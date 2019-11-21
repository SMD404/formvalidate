document.addEventListener('DOMContentLoaded', function() {
    let form = document.getElementById('buy-ticket'),
        btn = form.querySelector('.button'),
        email = form.querySelector('.ticket__input-email'),
        phone = form.querySelector('.ticket__input-phone'),
        phoneMask = '+7 (000) 000-00-00';

    $(phone).mask(phoneMask);    

    const isValid = {
        email: function() {
            const isValid = email.checkValidity();
            if (isValid) email.classList.remove('error');  
            else email.classList.add('error');
            return isValid;
        },
        phone: function() {
            const isValid = phone.value.length === phoneMask.length;
            if (isValid) phone.classList.remove('error');  
            else phone.classList.add('error');
            return isValid;
        }
    }
    
    phone.addEventListener('keyup', isValid.phone);       
    email.addEventListener('keyup', isValid.email);        

    btn.addEventListener('click', async(event) => {

        if (!Object.values(isValid).map(f => f()).every(x => !!x)) {
            alert("Пожалуйста заполните все поля!");
            return;
        };

        const isCheckedRadio = (el) => {
            if (el.type !== "radio") return true;
            return el.checked;
        }

        const inputs = Array.from(form.querySelectorAll("input")).filter(isCheckedRadio);
        const fields = {};

        for (let i=0;i<inputs.length;i++) {
            const input = inputs[i];
            if (input.value === '') continue;            
            const name = input.name || input.placeholder;
            fields[name] = input.value;
        }

        console.log(fields);

        try {
            const res = await fetch('/store', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(fields)
            });
            if (res.status >= 400) throw res;
            console.log("HTTP SUCCESS!", res);
            alert('Форма успешно отправлена!');       
        } catch (ex) {
            console.error("HTTP FAILED!");
            console.error(ex);
            alert("Ошибка сервера при отправке формы!");
        }         
    });
});