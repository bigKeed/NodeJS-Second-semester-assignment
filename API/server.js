const http = require('http')
const fs = require('fs')
const path = require('path')
const url = require('url')

const PORT = 8000
const HOSTNAME = "localhost"

const itemsDbPath = path.join(__dirname, 'items.json')

const requestHandler = function (req, res){
    if(req.url === '/products' && req.method === 'GET'){
        getItems (req,res)
       } else if(req.url.startsWith ('/product/') && req.method === 'GET'){
        getOneItem (req,res)
       } else if (req.url === '/product/add' && req.method === 'POST') {
        addItem (req,res)
       } else if (req.url === '/product/update' && req.method === 'PUT') {
        updateItem (req,res)
       } else if (req.url === '/product/delete' && req.method === 'DELETE') {
        deleteItem (req,res)
       } else {
        res.writeHead(404);
        res.end('Route Entered Not Found')
       }
};

//desc: Get all items from inventory 
//route: /products && method: GET

function getItems (req,res){
    fs.readFile (itemsDbPath, 'utf8', (err,data)=>{
        if(err){
            res.writeHead(404);
            res.end('404 Not Found');
        } 

            res.end(data)
        
    })
}

//desc: Get an item from inventory 
//route: /products/:id && method: GET

function getOneItem (req,res){

    const id = parseInt(req.url.split('/')[2], 10);
    
    fs.readFile (itemsDbPath, 'utf8', (err,data)=>{
        if(err){
            res.writeHead(404);
            res.end('404 Not Found');
            return;
        } 
        const items = JSON.parse(data);
        const item = items.find(item => item.id === id);

        if(item){
            res.writeHead(200, {'conten-type': 'application/json'})
            res.end(JSON.stringify ({ success: true, data: item}));
        } else {
            res.writeHead(404, {'conten-type': 'application/json'})
            res.end(JSON.stringify ({ success: false, message: 'Item with specified ID not found '}))   
        }
            
        
    }); 
    };

    






//desc: Add an  item to the inventory 
//route: /product/add && method: POST

 function addItem (req,res){
      const body = [];
    
      req.on ( 'data', (chunk) => {
        body.push(chunk)
      })

      req.on ( 'end', () => {
        const parsedProd = Buffer.concat(body).toString()
        const newProduct = JSON.parse(parsedProd)
        console.log(newProduct)

        fs.readFile( itemsDbPath, 'utf8', (err,data)=> {
            if(err){
                console.log(err)
                res.writeHead(400)
                res.end('An error occured')
            } 
            
            const oldItems = JSON.parse(data)
            const allItems = [...oldItems, newProduct ]

            fs.writeFile (itemsDbPath, JSON.stringify(allItems), (err)=>{
                if(err){
                    console.log(err)
                    res.writeHead(500)
                    res.end(JSON.stringify(
                        {message:'An Internal server error occured'})
                )}
                res.end(JSON.stringify(allItems))
            })
          })
      })

    
}

//desc: update an  item in the inventory 
//route: /product/update && method: PUT

function updateItem(req,res){

    const body = [];
    
    req.on ( 'data', (chunk) => {
      body.push(chunk)
    })

    req.on ( 'end', () => {
      const parsedItem = Buffer.concat(body).toString()
      const itemToUpdate = JSON.parse(parsedItem)
      itemID = itemToUpdate.id

        fs.readFile( itemsDbPath, 'utf8', (err,data)=> {
            if(err){
                console.log(err)
                res.writeHead(400)
                res.end('An error occured')
            }
        
            const itemList = JSON.parse(data)
            const  itemIndex = itemList.findIndex( data => data.id === itemID)
            // console.log(itemIndex)
            if(err){
                res.writeHead(404)
                res.end('Book with specified ID not found')

            }

            const updatedItem = {...itemList[itemIndex],...itemToUpdate}
            itemList[itemIndex] = updatedItem
            
            fs.writeFile (itemsDbPath, JSON.stringify(itemList), (err)=>{
                if(err){
                    console.log(err)
                    res.writeHead(500)
                    res.end(JSON.stringify(
                        {message:'An Internal server error occured'})
                )}
                res.writeHead(201)
                res.end('Update sucessfull1!')
            })
    })

        
})
}

//desc: delete an  item from the inventory 
//route: /product/delete && method: DELETE

function deleteItem(req,res){
    const body = [];
    
    req.on ( 'data', (chunk) => {
      body.push(chunk)
    })

    req.on ( 'end', () => {
      const parsedItem = Buffer.concat(body).toString()
      const itemToUpdate = JSON.parse(parsedItem)
      itemID = itemToUpdate.id


        fs.readFile( itemsDbPath, 'utf8', (err,data)=> {
            if(err){
                console.log(err)
                res.writeHead(400)
                res.end('An error occured')
            }
        
            const itemList = JSON.parse(data)
            const  itemIndex = itemList.findIndex( data => data.id === itemID)
    
            if(err){
                res.writeHead(404)
                res.end('Book with specified ID not found')

            }

            itemList.splice(itemIndex,1)

            fs.writeFile (itemsDbPath, JSON.stringify(itemList), (err)=>{
                if(err){
                    console.log(err)
                    res.writeHead(500)
                    res.end(JSON.stringify(
                        {message:'An Internal server error occured'})
                )}
                res.writeHead(201)
                res.end('Deleted sucessfull1y!')
            })

        })

        
    })
    

}





const server = http.createServer(requestHandler)

server.listen( PORT, HOSTNAME, ()=> {
    console.log(`server listening on  http://${HOSTNAME}:${PORT}`)
})