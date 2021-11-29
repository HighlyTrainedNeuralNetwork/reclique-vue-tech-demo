<template>
  <div class="generalContainer">
    <div class="displayContainer">
      <div id="questionText" v-if="questionLoc < questions.length">{{questions[questionLoc]["description"]}}?</div>
      <div id="questionPosition">Current Question: {{questionLoc + 1 }} / {{this.questions.length}}</div>
      <table class="inputTable">
      <tr>
        <th></th>
        <th>Date</th>
        <th>Type</th>
        <th>Debit</th>
        <th>Credit</th>
      </tr>
      <tr v-for="(row, i) in rows" :key="i">
        <td><button type="button" v-if="i > 1" @click="deleteRow(i)">Delete Row</button></td>
        <td><input type="text" v-model="row.date"/></td>
        <td>
          <select name="transaction type" v-model="row.type">
            <option value="" disabled>Select transaction type</option>
            <option value="revenue">revenue</option>
            <option value="deferred">deferred</option>
            <option value="cash">cash</option>
            <option value="receivable">receivable</option>
            <option value="contra">contra</option>
            <option value="system-credit">system-credit</option>
          </select>
        </td>
        <td><input type="text" v-model="row.debit"/></td>
        <td><input type="text" v-model="row.credit"/></td>
      </tr>
      </table>
    </div>
    <div class="interactionContainer">
      <button type="button" @click="addRow()">Add Input Row</button>
      <button type="button" @click="submit()">Submit Answer</button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      questions: [],
      score: 0,
      questionLoc: 0,
      rows: [{date: "", type: "", debit: "", credit: ""}, {date: "", type: "", debit: "", credit: ""}],
      correctAnswers: []
    }
  },
  methods: {
    initialState: function() {
      this.rows = [{date: "", type: "", debit: "", credit: ""}, {date: "", type: "", debit: "", credit: ""}]
    },
    getQuestions2: async function() {
      let query = "https://reclique.github.io/web-dev-testing/1_accounting_game/questions.json"
      const response = await fetch(query)
      this.questions = await response.json()
    },
    getQuestions: function() {
      this.questions = [
    {
        "title": "Question #1",
        "description": "What are the entries for ringing up a $100 fee on 6/10 and paying for it on the same day",
        "correct_answers": [
            {
                "type": "cash",
                "entries": [
                    {
                        "when": "6/10",
                        "type": "cash",
                        "Dr": 100
                    },
                    {
                        "when": "6/10",
                        "type": "revenue",
                        "Cr": 100
                    }
                ]
            },
            {
                "type": "accrual",
                "entries": [
                    {
                        "when": "6/10",
                        "type": "cash",
                        "Dr": 100
                    },
                    {
                        "when": "6/10",
                        "type": "revenue",
                        "Cr": 100
                    }
                ]
            }
        ]
    },
{
        "title": "Question #2",
        "description": "What are the entries for ringing up a $100 fee on 6/10 and paying for it later 7/15",
        "correct_answers": [
            {
                "type": "cash",
                "entries": [
                    {
                        "when": "7/15",
                        "type": "cash",
                        "Dr": 100
                    },
                    {
                        "when": "7/15",
                        "type": "revenue",
                        "Cr": 100
                    }
                ]
            },
            {
                "type": "accrual",
                "entries": [
                    {
                        "when": "6/10",
                        "type": "receivable",
                        "Dr": 100
                    },
                    {
                        "when": "6/10",
                        "type": "revenue",
                        "Cr": 100
                    },
                    {
                        "when": "7/15",
                        "type": "cash",
                        "Dr": 100
                    },
                    {
                        "when": "7/15",
                        "type": "receivable",
                        "Cr": 100
                    }
                ]
            }
        ]
    }

    ]
    },
    submit: function() {
      this.evaluateAnswer()
      this.questionLoc += 1
      if (this.questionLoc == this.questions.length) {
        this.finish()
      } else {
        this.initialState()
      }
    },
    addRow: function() {
      console.log(this.questionLoc)
      this.rows.push({date: "", type: "", debit: "", credit: ""})
      console.log(this.rows)
    },
    removeRow: function() {
      this.rows.splice(-1)
    },
    evaluateAnswer: function() {
      const self = this
      let transform_dict = {when: "date", type: "type", Dr: "debit", Cr: "credit"}
      let temp_rows = self.rows
      temp_rows.sort(function(a, b) {
        if (a.date == b.date) {
          if (a.type == b.type) {
            if (a.debit == b.debit) {
              return a.credit < b.credit ? -1 : 1 
            } else {
              return a.debit < b.debit ? -1 : 1 
            }
          } else {
            return a.type < b.type ? -1 : 1 
          }
        } else {
          return a.date < b.date ? -1 : 1
        }
      })
      let answers = this.questions[this.questionLoc]["correct_answers"]
      let truthy = answers.some(function(answer) {
        let answer_rows = answer["entries"]
        answer_rows.sort(function(a, b) {
          if (a.when == b.when) {
            if (a.type == b.type) {
              if (a.Dr == b.Dr) {
                return a.Cr < b.Cr ? -1 : 1 
              } else {
                return a.Dr < b.Dr ? -1 : 1 
              }
            } else {
              return a.type < b.type ? -1 : 1 
            }
          } else {
            return a.when < b.when ? -1 : 1
          }
        })
        let subtruthy1 = false
        if (answer_rows.length == self.rows.length) {
          subtruthy1 = true
        }
        let subtruthy2 = answer_rows.every(function(row, index) {
          let rowKeys = Object.keys(row)
          let subsubTruthy = rowKeys.every(function(key) {
            if (key == "Dr") {
              if (row[key] == temp_rows[index][transform_dict[key]] && (temp_rows[index]["credit"] == "" || temp_rows[index]["credit"] == "0")) {
                return true
              } else {
                return false
              }
            } else if (key == "Cr") {
              if (row[key] == temp_rows[index][transform_dict[key]] && (temp_rows[index]["debit"] == "" || temp_rows[index]["debit"] == "0")) {
                return true
              } else {
                return false
              }
            } else {
              if (row[key] == temp_rows[index][transform_dict[key]]) {
                return true
              } else {
                return false
              }
            }
          })
          if (subsubTruthy == true) {
            return true
          } else {
            return false
          }
        })
        if (subtruthy1 == true && subtruthy2 == true) {
          return true
        } else {
          return false
        }
      })
      if (truthy == true) {
        this.correctAnswers.push(true)
        this.score += 1
      } else {
        this.correctAnswers.push(false)
      }
    },
    finish: function() {
      console.log(this.questionLoc)
      this.$router.push({ name: "endScreen" , params: {score: this.score, questions: this.questionLoc, correctAnswers: this.correctAnswers}})
    },
    deleteRow: function(index) {
      this.rows.splice(index, 1)
    }
  },
  created() {
    this.getQuestions2()
  },
}
</script>

<style scoped>
.displayContainer {
  text-align: center;
}
.inputTable {
  margin-right: auto;
  margin-left: auto;
}
.interactionContainer {
  text-align: center;
}
</style>