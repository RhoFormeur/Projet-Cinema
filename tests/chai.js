const chaiHttp = require("chai-http"),
    chai = require('chai'),
    should = chai.should(),
    expect = chai.expect,
    { app } = require("../index"),
    path = require("path");

chai.use(chaiHttp);

describe("CHAI // CONTROLLER", () => {
    let comment
    // it(" ChaiRouter // GET // Articles", (done) => {
    //     console.log('Chai test')
    //     done()
    // })

    // Test GET films 
    it("ChaiRouter // GET // Films", (done) => {
        chai
            .request(app)
            .get("/films")
            .end((err, res) => {
                if (err) return done(err)
                // Ici on demande à ce que res.body.articles doit être un 'array'
                res.body.should.be.a("array")
                // Ici on demande à ce que res soit un status 200
                res.should.have.status(200)
                // Et le done() permet de cloturer notre test
                done()
            })
    })

    // Test GET Article/:id
    it("ChaiRouter // GET // article/:id",(done)=>{
        chai
            .request(app)
            .get("/article/315162")
            .end((err,res)=>{
                if (err) return done(err)
                res.body.data[0].should.be.a("object")
                res.body.comments.should.be.a("array")
                res.body.genres.should.be.a("array")
                res.body.likes.should.be.a("array")
                res.should.have.status(200)
                done()
            })
    })

    // Test POST comment
    it("ChaiRouter // POST // comment",(done)=>{
        chai
            .request(app)
            .post("/article/315162")
            .set("Accept", "application/json")
            .send({content: "test", id_user:1})
            .end((err,res)=>{
                if (err) return done(err)
                comment = res.body.insertId
                res.body.should.be.a("object")
                res.should.have.status(200)
                done()
            })
    })

    // Test PUT comment
    it("ChaiRouter // PUT // comment",(done)=>{
        chai
            .request(app)
            .put("/article/315162")
            .set("Accept", "application/json")
            .send({content: "test le commentaire MAJ", id_comment : comment,})
            .end((err,res)=>{
                if (err) return done(err)
                res.body.should.be.a("object")
                res.should.have.status(200)
                done()
            })
    })

    // Test DELETE Comment
    it("ChaiRouter // DELETE // comment",(done)=>{
        chai
            .request(app)
            .delete("/article/315192")
            .set("Accept", "application/json")
            .send({id_comment : comment,})
            .end((err,res)=>{
                if (err) return done(err)
                res.body.should.be.a("object")
                res.should.have.status(200)
                done()
            })
    })

    // Test GET Admin
    it("ChaiRouter // GET // admin",(done)=>{
        chai
            .request(app)
            .get("/admin")
            .end((err,res)=>{
                if (err) return done(err)
                res.body.articles.should.be.a("array")
                res.body.users.should.be.a("array")
                res.body.comments.should.be.a("array")
                res.body.layout.should.equal("admin")
                res.should.have.status(200)
                done()
            })
    })

    // Test POST admin
    it("ChaiRouter // POST // article/admin",(done)=>{
        chai
            .request(app)
            .post("/admin")
            .set("Accept", "application/json")
            .send({id_article: 72, title:"test",release_date:"1993-11-03",overview:"synopsis",poster_path:"/test",id_user:1,type:"movie"})
            .end((err,res)=>{
                if (err) return done(err)
                res.body.should.be.a("object")
                res.should.have.status(200)
                done()
            })
    })

    // Test PUT admin
    it("ChaiRouter // PUT // article/admin",(done)=>{
        chai
            .request(app)
            .put("/admin")
            .set("Accept", "application/json")
            .send({overview: "test le nouveau film",id_article:72})
            .end((err,res)=>{
                if (err) return done(err)
                res.body.should.be.a("object")
                res.should.have.status(200)
                done()
            })
    })

    // Test DELETE admin
    it("ChaiRouter // DELETE // article/admin",(done)=>{
        chai
            .request(app)
            .delete("/admin")
            .set("Accept", "application/json")
            .send({id_article: 72})
            .end((err,res)=>{
                if (err) return done(err)
                res.body.should.be.a("object")
                res.should.have.status(200)
                done()
            })
    })
})
