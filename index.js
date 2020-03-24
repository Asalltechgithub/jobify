const express = require("express")
const  app =express()
const sqlite = require('sqlite') 
const dbconnection =sqlite.open('Jobify.sqlite',{Promise})
app.set('view engine','ejs')
app.use(express.static('public'))

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
    app.get("/admin/vaga/delete/:id",async(req,res)=>{

        const db = await dbconnection
        await db.run('delete from vagas where id ='+req.params.id+ '')
        
        res.redirect('/admin/vaga')
        })

    app.get('/admin/categoria',async(req,res)=>{
        const db = await dbconnection
        const Categorias = await db.all('select * from categorias')
        
        res.render('admin/categoria',{categorias:Categorias})
        
        })
app.get("/admin/categoria/delete/:id",async(req,res)=>{

const db = await dbconnection
await db.run('delete from categorias where id ='+req.params.id+ '')

res.redirect('/admin/categoria')
})


   
 app.listen(3000,(err)=>{

    if (err){
console.log("Não rodou ",err)
    }
    else{
        console.log("rodando")
    }
})