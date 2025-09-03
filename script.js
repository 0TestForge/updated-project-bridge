const token = document.cookie

console.log(token, "token")

if(!token){
    window.location.href = 'signup.html'
}
 

 