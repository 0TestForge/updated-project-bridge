const form = document.querySelector('form')

form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const name = form.userName.value
    const email = form.email.value
    const password = form.password.value
    
   
    try{
        const resp = await fetch('https://express-auth-indol.vercel.app/auth/sign-up', {
            method: 'POST',
            body: JSON.stringify({
                name,
                email,
                password
            }),
            headers: {
                'Content-Type': "application/json"
            }
        })
        if(resp.status === 201){
            alert('user registered successfully')
            window.location.hreft = 'signin.html'
        }
    }catch(e){

    }
})