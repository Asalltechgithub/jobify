const express = require("express")
const bodyparser=require("body-parser")
const  app =express()
const path = require('path')
const sqlite = require('sqlite') 
const dbconnection =sqlite.open(path.resolve(__dirname, 'Jobify.sqlite' ),{Promise})

const port =process.env.PORT || 3000

app.set('view engine','ejs')
app.use(express.static('public'))
app.use(bodyparser.urlencoded({extended:true}))

const init = async ()=>{
    const db = await dbconnection 
    await db.run('create table if not exists categorias (id INTEGER PRIMARY KEY, categoria TEXT); ')
    await db.run('create table if not exists vagas (id INTEGER PRIMARY KEY,vaga TEXT, categoriaID INTEGER,descricao TEXT); ')
    const categoria = 'Vagas em  Urgentes'
   
}


init()



app.get('/',async(req,res)=>{

    const db = await dbconnection
    const categoriasDb = await db.all("Select * from categorias;")
    const vagas = await db.all('Select * from vagas')
    const categorias =categoriasDb.map(cat=>{


        return{
    ...cat,
    vagas:vagas.filter( vaga=> vaga.categoriaID === cat.id )
}  
        
    })
    res.render('home',{
       categorias
    })
})
app.get('/vaga/:id',async(req,res)=>{
    const db = await dbconnection
const vaga = await db.get('select *from vagas  where id= '+req.params.id) 

    res.render("vaga", {
        vaga:vaga
    })
})
  
app.get('/admin/',(req,res)=>{


res.render('admin/home')

})

//// vagas 

app.get('/admin/vaga',async(req,res)=>{

    const db = await dbconnection
    const categoriasDb = await db.all("Select * from categorias;")
    const vagas = await db.all('Select * from vagas')
    const categorias =categoriasDb.map(cat=>{


        return{
    ...cat,
    vagas:vagas.filter( vaga=> vaga.categoriaID === cat.id )
}  
        
    })


        res.render('admin/vaga',{vagas,categorias})
    
    })
    app.post("/admin/vaga",async(req,res)=>{
       const {vaga,categoriaID,descricao}=req.body
       
        const db = await dbconnection
        await db.run(`insert into vagas(vaga, categoriaID ,descricao) values('${vaga}','${categoriaID}','${descricao}' )`)
        
        res.redirect('/admin/vaga')
        })

    app.get("/admin/vaga/delete/:id",async(req,res)=>{

        const db = await dbconnection
        await db.run('delete from vagas where id ='+req.params.id+ '')
        
        res.redirect('/admin/vaga')
        })
        app.post("/admin/vaga/editar",async(req,res)=>{
            const {id,vaga,catID,descricao}=req.body
            
        console.log(id,vaga,catID,descricao)
            const db = await dbconnection
            await db.run(`update vagas set vaga ='${vaga}',categoriaID ='${catID}',descricao ='${descricao}'  where id ='${id}'`)
             
            
            res.redirect('/admin/vaga')
            })
   
   
   
   /// categoria
   
   app.post("/admin/categoria/editar",async(req,res)=>{
    const {id,categoria}=req.body
    
    
    const db = await dbconnection
    await db.run(`update categorias set categoria ='${categoria}' where id ='${id}'`)
     
    
    res.redirect('/admin/categoria')
    })

        app.get('/admin/categoria',async(req,res)=>{
        const db = await dbconnection
        const Categorias = await db.all('select * from categorias')
        
        res.render('admin/categoria',{categorias:Categorias})
        
        })
        app.post("/admin/categoria",async(req,res)=>{
            const {categoria}=req.body
            
             const db = await dbconnection
             await db.run(`insert into categorias(categoria) values('${categoria}')`)
             
             res.redirect('/admin/categoria')
             })

             app.get("/admin/categoria/delete/:id",async(req,res)=>{


                const db = await dbconnection

                await db.run('delete from categorias where id ='+req.params.id+ '')


                res.redirect('/admin/categoria')

            })


   
 app.listen(port,(err)=>{

    if (err){
console.log("Não rodou ",err)
    }
    else{
        console.log("rodando")
    }
})