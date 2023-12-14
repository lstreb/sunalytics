//parametros fixos
let G_ref = 800;
let k = 1.38 * Math.pow(10, -23);
let e = 1.60 * Math.pow(10, -19);
let m = 1.25, Eg = 1.1, Rs = 0.0075, Rp = 1000;

//Parametros do painel
let Voc_ref = 22.65, Isc_ref = 3.8, Vm_ref = 18.53, Im_ref = 3.592, Pm = 66.6, FF = 0.773, Tref = 25, N = 36;

//Coeficientes de temperatura
let Beta = -82.8 * Math.pow(10, -3);
let Alpha = 1.15 * Math.pow(10, -2);
let Gama = -0.4, NOCT = 45;
let Kt = (45 - 20) / 800;

let V = 0, Id = 0, Irp = 0, pot = 0, Pmax = 0, Imax = 0, Vmax = 0, I = 0, Ia = 1;

let TmodK = 0, TmodAnterior = 1;
let TrefK = 273 + Tref;
let IL = 0, Voc = 0, Pmp = 0;

let Vtn = N * k * TrefK / e;
let Ion = 0, Io = 0;
let Tmod = 25, G = 800;

//exibicao no site
let eixoX = [], eixoY = [];
let resultado;

//função que pega os valores de irradiância e temperatura
//quando o botão "simular" é clicado
function pegaValores() {
    TmodK = 0; IL = 0; Voc = 0; Pmp = 0; Ion = 0; Io = 0; Ia = 0; I = 0; Id = 0; Irp = 0; pot = 0; V = 0; Pmax = 0; Vmax = 0; Imax = 0; eixoX = []; eixoY = [];

    const input1 = document.getElementById('temperatura');
    Tmod = Number(input1.value);

    const input2 = document.getElementById('irradiancia');
    G = Number(input2.value);

    testaErros();
}

//função que testa se os valores inseridos são válidos
//se forem válidos, exibe o resultado
function testaErros() {
    if (Tmod < 0 || G < 0) { 
        alert("Os valores inseridos não podem ser menores que zero"); 
    }

    else if (G > 1000) { 
        alert("A irradiância solar não pode ser maior que 1000W/m²"); 
    }

    else if (Tmod > 100) { 
        alert("A temperatura do painel não pode ser maior que 100ºC"); 
    }

    else if (!G || !Tmod) { 
        alert("Os valores não podem ser nulos"); 
    }

    else {
        resultado = calculo();
        resultado = parseFloat(resultado).toFixed(2);
        exibe(resultado);
        plotaGrafico();
    }
}

//função que exibe o resultado do cálculo de potência
function exibe(resultado) {
    const html = `<h3 class="result-title">Potência máxima (W)</h3>
       <div class="result">${resultado}</div>
       <div class="graph-container"><canvas id="grafico"></canvas></div>`;

    document.getElementById('result-container').innerHTML = html;
}

function calculo() {
    TmodK = 273 + Tmod;
    IL = (Isc_ref + (Alpha * (Tmod - 25))) * G / 1000;
    Voc = Voc_ref + Beta * (Tmod - 25);
    Pmp = Vm_ref * Im_ref + (Gama * (Tmod - 25));
    Ion = Isc_ref / (Math.exp((Voc / (m * Vtn))) - 1);
    Io = Ion * Math.pow((TmodK / TrefK), 3) * (Math.exp(((e * Eg) / (m * k)) * ((1 / TrefK) - (1 / TmodK))));

    while (I >= 0) { //calcula a corrente até chegar a 0
        for (let i = 0; i < 10; i++) {
            Ia = I;
            Id = Io * ((Math.exp((e / (N * m * k * TmodK)) * (V + Rs * I))) - 1);
            Irp = (V + I * Rs) / Rp;
            I = IL - Id - Irp;
        }

        pot = V * I;
        V = V + 0.1;

        eixoX.push(V); eixoY.push(I);

        if (Pmax < pot) { //acha o ponto de máxima potência
            Pmax = pot;
            Vmax = V;
            Imax = I;
        }
    }
    return Pmax;
}

function plotaGrafico() {
    let temp = eixoX.map(value => parseFloat(value).toFixed(2));

    const graph = document.getElementById('grafico');

    let chart = new Chart(graph, {
        type: 'line',
        data: {
            labels: temp,
            datasets: [{
                label: "Curva característica do painel",
                backgroundColor: "rgb(0, 72, 167)",
                data: eixoY
            }]
        }
    })
}