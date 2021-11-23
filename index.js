const express = require("express")
const knex = require("knex")
const cors = require("cors")
//const { res } = require("express")
const databaseConfig = require("./knexfile").development

const{ Model } = require("objection")


const app = express()
const database = knex(databaseConfig)
Model.knex(database)

app.use(cors())

class Student extends Model { 
    static get tableName() {
        return 'student';
      }
    //static tableName ='student';

    static relationMappings = {
        courses:{
            relation: Model.ManyToManyRelation,
            modelClass: Course,
            //db related part
            join: {
                from: "student.id",
                through: {
                    from: "enrollment.student_id", 
                    to:"enrollment.course_id"
                },
                to:"course.id"
            }
        }

    }
      
}

class Course extends Model { 
    static get tableName() {
        return 'course';
      }
}

app.get("/students", (req,res) => {
    Student.query().withGraphFetched("courses")
        .then(students => {
            res.json({ students })
        }).catch(error =>{
            console.error(error.message)
            res.sendStatus(500)
        })
})

app.get("/courses", (req,res) => {
    Course.query()
        .then(courses => {
            res.json({ courses })
        })
})

app.get("/",(req,res)=>{
    res.json({message:"you are always in my heart"})

})

app.listen(4000)
