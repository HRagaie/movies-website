console.log("starting");

const express = require('express')
const path = require('path')
const fs = require('fs')
const bodyParser = require('body-parser')
// const flash = require('express-flash')
 const session = require('express-session')


const app = express()

app.use(express.static('public'))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname,'views'))
app.use(bodyParser.urlencoded({ extended: false }))

// app.use(flash()); //???
var x = 0;
app.use(
    // Creates a session middleware with given options.
    session({
      name: x++,
      user:'',
      event: false,
      saveUninitialized: false,
      resave: false,
      secret: 'This is my very long string that is used for session in http!',
      cookie: {
        maxAge: 1000 * 60 * 60 * 2,
        sameSite: true,
      }
    })
  )


// GET (specific url) & their corresponding POSTs
/////miand-1
// let globalusername = '';
////

app.get('/', function(req,res){
    res.render('login', {error: ""})
})

app.post('/', function(req,res){
    
  
    if (req.body.username == "" || req.body.password == "") {
        res.render('login', { error: "You must fill in all fields"});

    }
    else {
      console.log("ANA FEL ELSE")
        var check = false;
        for (i = 0; i < arrayInFile.length; i++) {
            var objInArray = arrayInFile[i]; //get current object
            var username = objInArray.username; //extract the username.
            var password = objInArray.password;
            if(username == req.body.username && password == req.body.password ){
              req.session.globaluser = req.body.username
              console.log('SESSION USERNAME:::::::' + req.session.globaluser)
                res.redirect('/home')
                check = true;
            }
        }
        if(check == false){
            res.render('login', { error: "Wrong username or password"});
        }
    }

})


app.get('/registration', function(req,res){

    res.render('registration',{error:"", registered:""})
})

app.post('/register', function (req, res) {

    console.log(req.body.username)
    if (req.body.username == "" || req.body.password == "") {
        res.render('registration', { error: "You must fill in all fields", registered: "" });
    }
    else {
        if (checkExist(req.body) == "error") {
            //res.locals.fail_msg= req.flash('error', 'Username already exists');
            //res.redirect('/registration')
            res.render('registration', { error: "Username already exists", registered: "" });
            console.log("ERROR FOUND")
        }
        else {
          
          res.render('login', { error: "Registeration Successful, now you can login in :)" })
          //res.redirect('/')
        
        }
    }
});

let readFile = function(x){
    try{
        let bufferedData = fs.readFileSync(x)
        //let stringData = bufferedData.toString() // turned to json string
        //let usersArray = JSON.parse(stringData) // turned to js obj
        let usersArray = JSON.parse(bufferedData) // turned to js obj
        return usersArray
    }
    catch (error) {
        return[]
    }
}

let arrayInFile = readFile('users.json')

let writeFile = function(newUser){

    arrayInFile.push(newUser);
    fs.writeFileSync("users.json", JSON.stringify(arrayInFile));
}
let checkExist = function(userFromPost){
    let usernameFromPost = userFromPost.username
    console.log("ANA HENA YA WELAD" + usernameFromPost )
    for (i = 0; i < arrayInFile.length; i++) {
        var objInArray = arrayInFile[i]; //get current object
        var username = objInArray.username; //extract the username.
        if(username == usernameFromPost){
            console.log("User already exists")
            return "error"
        }
    }
    writeFile(userFromPost);
    console.log("Registered")
    return 
}

/////////////////////miand3////////////////////

let readwishlist = function(){
  try{
   bufferedData = fs.readFileSync('wishlist.json');
   let wisharray= JSON.parse(bufferedData)
   return wisharray
  }
  catch (error) {
    return[];
  }
}

let wisharray = readwishlist();

let updateWishList = function(username,movie){
  wisharray.push({username,movie});
  fs.writeFileSync("wishlist.json",JSON.stringify(wisharray));
}

let ckeckwish = function(username,movie){
  for (i=0;i<wisharray.length;i++){
    var wishi = wisharray[i];
    var moviei = wishi.movie;
    var useri = wishi.username
    if(useri == username && moviei == movie)
      return "error"
  }
  updateWishList(username,movie)
}

app.get('/godfather2wish',function(req,res){
  console.log('GLOBAL USERNAME GF2' + req.session.globaluser)
  if(ckeckwish(req.session.globaluser,'godfather2')=='error')
    res.render('godfather2',{error:'This movie already exists in your watchlist'})
  else
    res.redirect('/godfather2')
})
app.get('/godfatherwish',function(req,res){
  console.log('GLOBAL USERNAME GF'+ req.session.globaluser)
  if(ckeckwish(req.session.globaluser,'godfather')=='error')
    res.render('godfather',{error:'This movie already exists in your watchlist'})
  else
  res.redirect('/godfather')
})
app.get('/fightclubwish',function(req,res){
  console.log(req.session.globaluser)
  if(ckeckwish(req.session.globaluser,'fightclub')=='error')
    res.render('fightclub',{error:'This movie already exists in your watchlist'})
  else
  res.redirect('/fightclub')
})
app.get('/darkknightwish',function(req,res){
  console.log(req.session.globaluser)
  if(ckeckwish(req.session.globaluser,'darkknight')=='error')
  res.render('darkknight',{error:'This movie already exists in your watchlist'})
  else
    res.redirect('/darkknight')
})
app.get('/screamwish',function(req,res){
  console.log(req.session.globaluser)
  if(ckeckwish(req.session.globaluser,'scream')=='error')
  res.render('scream',{error:'This movie already exists in your watchlist'})
  else
    res.redirect('/scream')
})
app.get('/conjuringwish',function(req,res){
  console.log(req.session.globaluser)
  if(ckeckwish(req.session.globaluser,'conjuring')=='error')
  res.render('conjuring',{error:'This movie already exists in your watchlist'})
  else
    res.redirect('/conjuring')
})

//////end 3

app.get('/home',function(req,res){
  res.render('home')
})

app.get('/drama',function(req,res){
    res.render('drama')
})


app.get('/horror',function(req,res){
    res.render('horror')
})

app.get('/action',function(req,res){
    res.render('action')
})


app.get('/godfather',function(req,res){
    res.render('godfather',{error:''})
})


app.get('/godfather2',function(req,res){
    res.render('godfather2',{error:''})
})


app.get('/scream',function(req,res){
    res.render('scream',{error:''})
})


app.get('/conjuring',function(req,res){
    res.render('conjuring',{error:''})
})


app.get('/fightclub',function(req,res){
    res.render('fightclub',{error:''})
})

app.get('/darkknight',function(req,res){
    res.render('darkknight',{error:''})
})


app.get('/watchlist',function(req,res){
  let userwatch = []
  for(i=0;i<wisharray.length;i++){
    if(wisharray[i].username == req.session.globaluser){
      userwatch.push(wisharray[i].movie)
    }
  }
    res.render('watchlist',{movies: userwatch})
})


app.get('/searchresults',function(req,res){
  res.render('searchresults', {movie:[], error: ""})
})

app.post('/search',function(req,res){
  let movieArray = readFile('movie.json')
  let arrayResult = []
  var search = req.body.Search
  console.log('SEARCH WORD ' + search)
  for (i = 0; i < movieArray.length; i++) {
    
    let stringInfile = (JSON.stringify(movieArray[i].movie)).toLowerCase()
    let stringInSearch = search.toLowerCase()
    if(stringInfile.includes(stringInSearch)){
      arrayResult.push(movieArray[i])
      // console.log(movieArray[i])
    }
    
    //display each movie

}
for(i=0;i<arrayResult.length;i++){
  console.log(arrayResult[i])
}
if(arrayResult.length == 0){
  res.render('searchresults',{movies: [], error: "Movie not found"})
}
  res.render('searchresults',{movies: arrayResult, error: ""})
})



//console.log("Listening to port 888")
var port = process.env.PORT || 3000;
app.listen(port);
