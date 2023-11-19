let irr = 0, temp = 0;

//função que pega os valores de irradiância e temperatura
//quando o botão "simular" é clicado
function pegaValores(){
    const input1 = document.getElementById('temperatura');
    temp = input1.value;

    const input2 = document.getElementById('irradiancia');
    irr = input2.value;

    testaErros();
}

//função que testa se os valores inseridos são válidos
//se forem válidos, exibe o resultado
function testaErros(){
    if(irr < 0 || temp < 0){
        alert("Os valores inseridos não podem ser menores que zero");
    }

    else if(irr > 1000){
        alert("A irradiância solar não pode ser maior que 1000W/m²");
    }

    else if(temp > 100){
        alert("A temperatura do painel não pode ser maior que 100ºC");
    }

    else if(!irr || !temp){
        alert("Os valores não podem ser nulos");
    }

    else{
        exibe();
    }
}

//função que exibe o resultado do cálculo de potência
function exibe(){
    const html = `
       <h3 class="result-title">Potência máxima (W)</h3>
       <div class="result">10W</div>
       `;

    document.getElementById('result-container').innerHTML = html;
}