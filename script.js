var unsub = null;
db.collection('Test').get().then(function(res){
    res.docs.forEach(function(x){
    });
}).catch(function(e){
    alert('Oops! Error caught 😅')
});


// audio
var  sendAudio= new Audio('audio/zapsplat_technology_computer_apple_magic_keyboard_space_bar_press_002_17523.mp3');
var upNameAudio=new Audio('audio/send.mp3');
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
   }
    
});



// User

class user{
    constructor(name,room,n)
    {
        this.name=name;
        this.room=room;
        this.pic=n;
    }

    pushMessageDB(data){
        
        const about={
            message:data,
            name:this.name,
            room:this.room,
            pic:this.pic,
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
        
        <div class="space"></div>
            <div class="chatPN">
                <div class="chatpic"><img src="profile_pic/${obj.pic}.jpg" alt=""></div>

                <div class=""txtside>
                
                <div class="userName">${obj.name}</div>
                <div class="textm"> ${obj.message}</div>
                </div>
            </div>
        &nbsp;&nbsp;
        
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
        localStorage.setItem('name',n);
    }


    updatepic(n)
    {
        this.pic=n;
        localStorage.setItem('pnum',n);
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


// pic collection
const q=document.querySelector('.picollection');
document.querySelector('.fa-angle-double-right').addEventListener('click',function(){
    upNameAudio.play();
    q.classList.toggle('pictoggle');
});

var imgs=0;
var id=-1;

q.addEventListener('click',function(e){

   if(e.target.tagName=='IMG'){
    Array.from(q.children).forEach(function(x){
        x.children[0].classList.contains('pickclick') ? x.children[0].classList.remove('pickclick'):1;
    });
 e.target.parentElement.classList.add('pickclick');

    imgs=e.target.getAttribute('src'); // img
    id=e.target.parentElement.getAttribute('data-id');
    }
});


const pickbtn=document.querySelector('.picExcBtn');
const userpic=document.querySelector('.profile');



pickbtn.addEventListener('click',function(){
    if(imgs!=0)
    {
        userpic.children[0].setAttribute('src',imgs);
        u1.updatepic(id);
    }
})



var u1;
const z=localStorage.getItem("name");
const pnum=localStorage.getItem("pnum");

if( z=== null)
{
    const u2=new user('Hiccup','',8);
    u2.updateRoom('General');
    u1=u2;
}
else{
    if(pnum==null)
    {
        const u2=new user(z,'',8);
        u1=u2;
    }
    else{
        const u2=new user(z,'',pnum);
        u1=u2;
        userpic.children[0].setAttribute('src',`profile_pic/${pnum}.jpg`);
    }
    
    u1.updateRoom('General');
    cn.textContent=z;
}




// ----------------Real time listener------------------

// only listen to values having room = current room


