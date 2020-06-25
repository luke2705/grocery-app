
function getCookie(cname) {
    var name = cname + "=";
    var cookies = document.cookie.split(';');
    for(var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) == ' ') {
        cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) == 0) {
        return JSON.parse(cookie.substring(name.length, cookie.length));
        }
    }
    return {};
}

function removeFromCartDictCookie(item){
    updateCookieDict('remove', item)
}
function addToCartDictCookie(item, quantity){
    updateCookieDict('add', item, quantity)
}
function updateCookieDict(operation, item, quantity=0){
    cartDictCookie=getCookie('cartDict');
    if (operation=='add'){
        cartDictCookie[item]=parseInt(quantity);
    }
    if (operation=='remove'){
        delete cartDictCookie[item];
    }
    document.cookie = "cartDict=" +(JSON.stringify(cartDictCookie))+ ";path=/;"
}
    
function caseInsensitiveSort(a, b){
    return a.toLowerCase().localeCompare(b.toLowerCase());
}
function titleCase(str) {
    return str.replace(
        /\w\S*/g,
        function(txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        }
    );
}

$(document).ready(function(){
    console.log('{{Ingredients}}')
})

function openNav() {
    document.getElementById("mySidenav").style.right = "0px";
    document.body.style.backgroundColor = "rgba(0,0,0,0.4)";
    // had to change .meal to #meals for items page
    $(".meal img, #meals .btn, .meal .btn").each(function() {
        $(this).css("opacity", "0.4");
        $(this).attr('disabled','');
    });
    $('.fixed-top').each(function(){$(this).css("background-color","#d8767f")})
}        
function closeNav() {
    document.getElementById("mySidenav").style.right = "-250px";
    document.body.style.backgroundColor = "white";
    // had to change .meal to #meals for items page
    $(".meal img, #meals .btn, .meal .btn").each(function() {
        $(this).css("opacity", "1");
        $(this).removeAttr('disabled','');
    });
    $('.fixed-top').each(function(){$(this).css("background-color","#dc3545")})
}

// console.log('{{recipes}}')
// // couldn't figure out how to cleanly parse python dictionary sent from django
// console.log('{{recipes}}'.replace(/&#x27;/g,'"'))
// var recipes = JSON.parse('{{recipes}}'.replace(/&#x27;/g,'"'));
// // var recipes = '{{recipes}}';
// var cartDict = {};
// // var recipes={};
// var alacarteItems={};
// var locations={};


// function sendText(){
//     let text = ""
//     for (item in cartDict){
//         text+= item + "- " + cartDict[item]+", ";
//     }
//     console.log(data)
//     console.log(text)
//     // $.post('http://localhost:3000/sendText', data)
//     sortGroceries();
// }
// function addMealToCart(item){
//     //add to or increment dict
//     meal = $(item).attr('id')
//     ingredientList = recipes[meal]["ingredients"]
//     for (ingredient in ingredientList){
//         if (!((ingredient) in cartDict)){
//             cartDict[ingredient] = ingredientList[ingredient];
//         }
//         else{
//             cartDict[ingredient] = cartDict[ingredient] + ingredientList[ingredient]; 
//         }
//     }
//     updateCart();
// }
// function addItemToCart(item){
//     item = $(item).attr('id')
//     if (!((item) in cartDict)){
//         cartDict[item] = 1;
//     }
//     else{
//         cartDict[item] ++
//     }
//     updateCart();
// }
// function removeFromCart(item){
//     delete(cartDict[item])
//     updateCart();
// }
// function updateCart(){
//     cartString = ""
//     for (var key in cartDict){
//         cartString = cartString + `<tr id ="${key}" style='bottom-border:5px black'><td>${key}</td><td style="padding-left:10px"><input type="number" onchange="cartManuallyChanged(event)" style="width:40px" min="1" value=${cartDict[key]}></td><td style="padding-left:10px"><a href="#" onclick="removeFromCart('${key}')" class="d-none d-md-block"><span class="close">&times;</span></a></tr>`;
//         // cartString = cartString + `<tr id ="${key}" style='bottom-border:5px black'><td>${key}</td><td style="padding-left:10px"><input type="number" onchange="cartManuallyChanged(event)" style="width:40px" min="1" value=${cartDict[key]}></td><td style="padding-left:10px"><a href="#" onclick="removeFromCart('${key}')" class="d-none d-md-block">remove</a><span class="close d-block d-md-none">&times;</span></tr>`;
//             // cartString = cartString + `<div id ="${key}"><div class="col-6">${key}</div><div class="col-3" style="padding-left:50px"><input type="number" onchange="cartManuallyChanged(event)" style="width:40px" min="1" value=${cartDict[key]}></div><div class="col-3 style="padding-left:50px"><a href="#" onclick="removeFromCart('${key}')">remove</a></div>`;
//     }
//     $("#cartList").html("<table style='margin:auto'>" + cartString + "</table>")
    
//     // $("#cartList").html(cartString)
// }
// function cartManuallyChanged(event){
//     let ingredient = event.path[2].id;
//     let quantity = parseInt(event.target.value);
//     cartDict[ingredient]=quantity;
// }
// function appendAlacarteHTML(item){
//     $("#alacarte").append("<div id='"+item.name+"' onclick='addItemToCart(this)' class=' col-6 col-sm-4 col-lg-3' ><div class='selectable' style='padding:5px'>"+ item.name + "</div></div><br>")
//     alacarteItems[item.name]=item.location;
// }
// function appendMealHTML(meal){
//     // make menu tiles
//     $('#meals').append(`<div id = "${meal.name}" onclick="addMealToCart(this)" class="col-6 col-sm-4 col-lg-3">
//         <div class="row selectable" >
//             <div class="col-6"><img src="stub_meal.png" style="height:75px;width:75px;  border-radius:20px;"></div><div class="col-6">${meal.name}</div>
//         </div>
//     </div>`)
//     //add to recipes object
//     recipes[meal.name]={ingredients:meal.ingredients}
// }
// // When the user clicks on <span> (x), close the modal
// $(".close").click(function() {
//     $(".modal").css("display","none")
// })
// // When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//     var modal = document.getElementById("mealModal");
//     var modal2 = document.getElementById("alacarteModal");
//     if (event.target == modal) {
//             modal.style.display = "none";
//     }
//     if (event.target == modal2) {
//         modal2.style.display = "none";
//     }
// }
// function addFromModal(modalName){
    
//     var modal = document.getElementById("mealModal");

//     //name is either the alacarte item or the meal
//     name = $("#"+modalName+"ID").val();
//     if(modalName=="alacarte"){
//         collection="alacarte"
//         __location = $("#alacarteLocation").children('option:selected').text();
//         object = {name:name, location:__location}
//         appendAlacarteHTML(object)
//         document.getElementById("alacarteModal").style.display="none";
//     }
//     if(modalName=="meal"){
//         //set meal object later
//         //object = {name:name, ingredients:ingredients}
//     }
//     //stole this code from above, need to refactor later
//     item=name;
//     if (!((item) in cartDict)){
//         cartDict[item] = 1;
//     }
//     else{
//         cartDict[item] ++
//     }
//     updateCart();
//     //I used this for initial setup, but may re-enable later
//     addToDB = false;
//     if(addToDB){
//         //send to server to add to DB
//         let message = {collection:collection, object:JSON.stringify(object)}
//         $.post(baseUrl + "/addToDB", message)
//     }
    
// }
// function sortGroceries(){
//     sortedCart=[];
//     for(item in cartDict){
//         sortableItem = {
//             name:item,
//             quantity:cartDict[item],
//             location:alacarteItems[item],
//             locationIndex: locations[alacarteItems[item]]
//         }
//         insertIndex=sortedCart.length;
//         let i=0
//         for (i;i<sortedCart.length;i++){
//             if(sortedCart[i].locationIndex>sortableItem.locationIndex){
//                 insertIndex = i;
//                 break;
//             }
//         }
//         sortedCart.splice(i,0,sortableItem);
//     }
// // console.log(sortedCart);
// let text = ""
// for(i=0;i<sortedCart.length;i++){
//     item = sortedCart[i]
//     text+= item.name + "- "+item.quantity;
//     if (i!=sortedCart.length-1) {
//         text+= ", ";
//     }
//     else{
//         text+="."
//     }
// }
// alert(`here's your grocery list in order: ${text}`);
// cartDict={};
// updateCart();
// }