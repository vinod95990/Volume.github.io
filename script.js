var unsub = null;
db.collection('Test').get().then(function(res){
    res.docs.forEach(function(x){
    });
}).catch(function(e){
    console.log(e);
});


// audio
var upNameAudio = new Audio('audio/zapsplat_technology_computer_apple_magic_keyboard_space_bar_press_002_17523.mp3');
var sendAudio=new Audio('audio/send.mp3');
var roomAudio=new Audio('audio/rooms.mp3');

// selection ip fields

const ulist=document.querySelector('.chatUI');
const messageForm=document.querySelector('.ipm');
const messageField=document.querySelector('.ipm').ipmf;
const nameForm=document.querySelector('.fupdate');
const nameField=document.querySelector('.fupdate').unf;

const img=document.querySelector('.bg');

messageField.focus();

// name field to update

const cn=document.querySelector('.yourName');

// rooms

const rooms=document.querySelector('.rooms');
const btnarray=rooms.children;
// message
messageForm.addEventListener('submit',function(e){
    sendAudio.play();
    e.preventDefault();
    // add message to database 
    if(messageField.value!='')
    {
        u1.pushMessageDB(messageField.value);
        messageField.value='';
    }
    else{
        alert('Empty');
    }

});

// name
nameForm.addEventListener('submit',function(e){
    e.preventDefault();
    upNameAudio.play();
   

    if(nameField.value!='')
    u1.updateName(nameField.value);
    nameField.value='';
});

// rooms
rooms.addEventListener('click',function(e){
    
   const r=e.target.parentElement.getAttribute('data-id');
  
   if( r=='General' || r=='Gaming' || r=='ChillZ' || r=='Music' && r!=null)
   {    
       u1.updateRoom(r);
    Array.from(btnarray).forEach(function(x){
        
         if(x.classList.contains('active'))
         {
             x.classList.remove('active');
         }
     });
    roomAudio.play();
        e.target.parentElement.classList.add('active');
        img.setAttribute('src',`img/${r}.jpg`);
      
   }
    
});



// User

class user{
    constructor(name,room)
    {
        this.name=name;
        this.room=room;
    }

    pushMessageDB(data){
        
        const about={
            message:data,
            name:this.name,
            room:this.room,
            
            time:firebase.firestore.Timestamp.fromDate(new Date())
        };

        db.collection('Test').add(about).then(function(res){
            console.log('pushed message to db');
        }).catch(function(e){
            console.log(e);
        });

    }

    


    pushMessageUI(obj)
    {
        console.log('pused to ui');
        const html=`
        <li class="msg">
        <span class="userName">${obj.name}</span>&nbsp;&nbsp;<span class="textm"> ${obj.message}</span>
        <p class="time">${dateFns.distanceInWordsToNow(obj.time.toDate(),{addSuffix:true})}</p>
        </li>
        
        `;
       
        ulist.innerHTML+=html;
        const o=ulist.lastChild;
        ulist.scrollTo({ left: 0, top: ulist.scrollHeight, behavior: "smooth" });

        
    }



    updateName(n)
    {
        this.name=n;
        cn.textContent=n;
    }

    updateRoom(z)
    {
        if(z!=this.room) {
            typeof unsub === 'function' ? unsub() : null;
            this.room=z;
            ulist.innerHTML='';
            this.realTime(z);
        }

        
    }


    realTime(z){
        unsub = db.collection('Test').where('room','==',z).orderBy('time').onSnapshot(function(snap){
            // snap.docChanges() ->  returns array of changes 
            console.log(snap.docChanges());
            
            snap.docChanges().forEach(function(x){
                if(x.type==="added")
                {
                    console.log(x.doc.data());
                    u1.pushMessageUI(x.doc.data());
                    
                }
            });
        
            
        });
        return unsub;

       
    }
}


const u1=new user('Hiccup','');
u1.updateRoom('General');



// ----------------Real time listener------------------

// only listen to values having room = current room
