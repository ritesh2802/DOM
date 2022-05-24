
var uid = new ShortUniqueId();
const addBtn = document.querySelector(".add-btn");
const modalCont = document.querySelector(".modal-cont");
let textAreaCont = document.querySelector(".textarea-cont");
let colors=['lightPink','lightBlue','lightGreen','Yellow'];
let modalPriorityColor= colors[colors.length-1];
let mainCont= document.querySelector(".main-cont");
let  toolboxColors = document.querySelectorAll(".color");
let removeBtn = document.querySelector(".remove-btn");

let ticketsArr=[];

let ticketLockClass="fa-lock";
let ticketUnlockClass ="fa-lock-open";

let isModalPresent = false;
// falg h jo bata rha h ki startinf me modal present ni h
addBtn.addEventListener('click',function(){

    
    //  maan ke chl rhe h ki modal present ni h 
    if(!isModalPresent){
        // agr ye condition shi h ki modal prent ni h to add kro aur flag true kr do
    modalCont.style.display="flex";
    // Modal add ho gya h
    // isModalPresent=!isModalPresent;
    //  ab is falg ko true krna padega
    }
    else{
        // agr modal present h to hata do aur flag false kr do
        modalCont.style.display="none";
        // modal hat gya
        // isModalPresent=!isModalPresent;
        // ab flag ko flase kr denge
    }
    isModalPresent=!isModalPresent; 
    // toggling effect true h to false false h to true kyunki ye kaam if else dono me hi krna pd rha h
});

// modal ke andar jo priority colors h unpr click krne pr ek laal color ka dabba aa jata h uske liye code , active class ka rotaion;

let allPriorityColors= document.querySelectorAll(".priority-color");
// saare priority color ka array aa gya

allPriorityColors.forEach(function(colorElement){
    //allPriorityColors wale array pr loop kiya usme hr color element aa gya

    colorElement.addEventListener('click',function(){
        // hr colorElement pr addEvent listner lga diya ab kya kre ? ab ye krenge ki 
        // fr se allPriorityColor wale array pr looop lagayenge ar sbme se active classs hata denge;
        allPriorityColors.forEach(function(priorityColorElem){
            priorityColorElem.classList.remove("active");
            // isme "." ni lagate h
        });

        // ab jis color element pr click hua h usme active class add kr denge

        colorElement.classList.add("active");

        // modalPriority color ko yaha se utha lenge ye ticket me lagani h n
        modalPriorityColor= colorElement.classList[0];

    });

});

    // ticketb generate krenge aur usko apne main cont me chipka denge iske liye hme modal me jo likha h wo text chiaye aur usme jo priority color select hoga wo bi chiaye ;

    // modalCont pr addEventListener lagayenge jisme shift dabane pr ticket generate hokr main cont me chipak jaye aur modal gayab ho jaye aur falg acc false homjaye 
    modalCont.addEventListener('keydown',function(e){
        let key = e.key;
        
        if(key== "Shift"){
            // console.log(modalPriorityColor+";;;"+textAreaCont.value)
            createTicket(modalPriorityColor,textAreaCont.value);
            modalCont.style.display="none";
            isModalPresent=false;
            textAreaCont.value=" ";
            allPriorityColors.forEach(function(colorElem){
                colorElem.classList.remove("active");
            })

        }
    });

    function createTicket(ticketColor,data,ticketId){
        let ticketCont = document.createElement("div");
        ticketCont.setAttribute("class","ticket-cont");
        let id = ticketId || uid();
        ticketCont.innerHTML=`
        <div class="ticket-color ${ticketColor}"></div>
        <div class="ticket-id">${id}</div>
        <div class="task-area">${data}</div>
        <div class="ticket-lock">
            <i class="fa-solid fa-lock"></i>
      </div>
        `;
        mainCont.appendChild(ticketCont);

        handleRemoval(ticketCont,id);
        handleColor(ticketCont,id);
        handleLock(ticketCont,id);

        if(!ticketId){
            // ticket jb pehle baar bn rhi hogi to ticketId ni hogi
            ticketsArr.push({
                ticketColor,
                data,
                ticketId:id
            });

            localStorage.setItem("tickets",JSON.stringify(ticketsArr));
        }
        
    };
        // agar local storage me ticket h to get the tickets from local storage

        if(localStorage.getItem("tickets")){
            ticketsArr = JSON.parse(localStorage.getItem("tickets"));
            ticketsArr.forEach(function(ticketObj){
                createTicket(ticketObj.ticketColor,ticketObj.data,ticketObj.ticketId);
            })
        };

        // filter tickets on the basis of ticket color

        for(let i=0;i<toolboxColors.length;i++){
           
            toolboxColors[i].addEventListener("click",function(){
                let currtoolboxColor = toolboxColors[i].classList[0];
                let filteredTickets = ticketsArr.filter(function(ticketObj){
                    if(currtoolboxColor==ticketObj.ticketColor){
                        return ticketObj;
                    }

                    // return currToolBoxColor == ticketObj.ticketColor;
                });

                // remove all tickets
                let allTickets = document.querySelectorAll(".ticket-cont");
                allTickets.forEach(function(ticketObj){
                    ticketObj.remove();
                });

                // display filtered tickets
                filteredTickets.forEach(function(ticketObj){
                    createTicket(ticketObj.ticketColor,ticketObj.data,ticketObj.ticketId);
                })
            })

            // to display all tikects on double click

            toolboxColors[i].addEventListener("dblclick",function(){

                // remove all tickets
                let allTickets = document.querySelectorAll(".ticket-cont");
                allTickets.forEach(function(ticketObj){
                    ticketObj.remove();
                });

                // display all tickets

                ticketsArr.forEach(function(ticketObj){
                    createTicket(ticketObj.ticketColor,ticketObj.data,ticketObj.ticketId);
                })
            })
        }

        let removeBtnActive = false;

        removeBtn.addEventListener("click",function(){
            if(removeBtnActive){
                removeBtn.style.color="white";
            }
            else{
                removeBtn.style.color="red";
            }

            removeBtnActive = !removeBtnActive;

        })

        // removes ticket from ls and ui
        function handleRemoval(ticket,id){

            
            ticket.addEventListener("click",function(){
                if(!removeBtnActive) return;
                
                
                
                
                // get idx of ticket to be deleted
                let idx = getTicketIdx(id);
                ticketsArr.splice(idx,1);

                // removed from local storage and set updataed array
                localStorage.setItem("tickets",JSON.stringify(ticketsArr));

                // frontend se remove
                 ticket.remove();
            })
        }

        //returns index of the ticket inside Local Storage's array
        function getTicketIdx(id) {
            let ticketIdx=ticketsArr.findIndex(function (ticketObj) {
                return ticketObj.ticketId == id;
            })
            return ticketIdx;
        }

        function handleColor(ticket,id){
            let ticketColorStrip = ticket.querySelector(".ticket-color");

            ticketColorStrip.addEventListener("click",function(){
                let currTicketColor = ticketColorStrip.classList[1];

                let currTicketColorIdx = colors.indexOf(currTicketColor);
                let newTicketColorIdx = currTicketColorIdx +1;

                newTicketColorIdx = newTicketColorIdx % colors.length;
                newTicketColor= colors[newTicketColorIdx];
                ticketColorStrip.classList.remove(currTicketColor);
                ticketColorStrip.classList.add(newTicketColor);

                // local storage update

                let ticketIdx = getTicketIdx(id);
                ticketsArr[ticketIdx].ticketColor= newTicketColor;
                // console.log(ticketsArr[ticketIdx]);
                localStorage.setItem("tickets",JSON.stringify(ticketsArr));



            });
        }

        function handleLock(ticket,id){
            let ticketLockEle = ticket.querySelector(".ticket-lock");
            let ticketLock =ticketLockEle.children[0];
            let ticketTaskArea = ticket.querySelector(".task-area")
        //    console.log(ticketLock);
      
        ticketLock.addEventListener("click",function(){

            let ticketIdx = getTicketIdx(id);
           if(ticketLock.classList.contains(ticketLockClass)){
               ticketLock.classList.remove(ticketLockClass);
               ticketLock.classList.add(ticketUnlockClass);
               ticketTaskArea.setAttribute("contenteditable","true");
           }
           else{
            //    if lock is open
            ticketLock.classList.remove(ticketUnlockClass);
            ticketLock.classList.add(ticketLockClass);
            ticketTaskArea.setAttribute("contenteditable","false");
           }
           ticketsArr[ticketIdx].data = ticketTaskArea.innerText;
           localStorage.setItem("tickets",JSON.stringify(ticketsArr));
            
        });
            
        }
        




        


       


    
   
        


    