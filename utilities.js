
/**
 * Estrutura básica do padrão observer
 * return: Object
 */
function Observer() {
    let arr_observers = [];

    return {
        on: function (fnObserver) {
            arr_observers.push(fnObserver);
        },
        emit: function (commant) {
            for (const fn of arr_observers) {
                fn(commant);
            }
        }
    }
}


/**
 * Função para calcular representação de período
 * return: inteiro / Object
 */
function format_period(periodo, formato, overflow){
    var step, overflow = overflow || false;
    
    switch (formato) {
        case 'milliseconds': step = 1; overflow = overflow ? 1000 : false;
        break;
        case 'seconds': step = 1000; overflow = overflow ? 60 : false;
        break;
        case 'minutes': step = 1000*60; overflow = overflow ? 60 : false;
        break;
        case 'hours': step = 1000*60*60; overflow = overflow ? 24 : false;
        break;
        case 'days': step = 1000*60*60*24; overflow = overflow ? 365.25 : false;
        break;
        case 'years': step = 1000*60*60*24*365.25; overflow = false;
        break;
        default:
        return {
            'milliseconds': format_period(periodo, 'milliseconds', true),
            'seconds': format_period(periodo, 'seconds', true),
            'minutes': format_period(periodo, 'minutes', true),
            'hours': format_period(periodo, 'hours', true),
            'days': format_period(periodo, 'days', true),
            'years': format_period(periodo, 'years'),
        }
    }
    
    return overflow ? ~~(Math.floor(periodo / step) % overflow) : Math.floor(periodo / step);
}


/**
 * Pegando um intervalo de datas
 */
function date_range(ctg) {
    const agora = new Date();
    const cod_semana = new Date().getDay();
    
    switch (ctg) {
        case 'agora':
        return [ agora, agora ]
        case 'ontem':
        return [ 
            new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() -1).getTime(),
            new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() -1).getTime()
        ]
        case '30diasatras':
        return [
            new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() -30).getTime(), 
            agora
        ]
        case '7diasatras':
        return [
            new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() -7).getTime(), 
            agora
        ]
        case 'semana':
        return [
            new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() - cod_semana).getTime(),
            new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() + (6 - cod_semana)).getTime()
        ]
        case 'semanapassada':
        return [
            new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() - (cod_semana +7)).getTime(),
            new Date(agora.getFullYear(), agora.getMonth(), agora.getDate() - (cod_semana +1)).getTime()
        ]
        case 'mes':
        return [
            new Date(agora.getFullYear(), agora.getMonth(), 1).getTime(), 
            new Date(agora.getFullYear(), agora.getMonth() + 1, 0).getTime()
        ]
        case 'mespassado':
        return [
            new Date(agora.getFullYear(), agora.getMonth() - 1, 1).getTime(), 
            new Date(agora.getFullYear(), agora.getMonth(), 0).getTime()
        ]
    }
}


/**
 * Preenchendo inputs com o período selecionado
 */
function set_inputs_period(inputs, periodo) {
    const [data_inicio, data_fim] = date_range(periodo);

    inputs[0].value = moment(data_inicio).format('YYYY-MM-DD');
    inputs[1].value = moment(data_fim).format('YYYY-MM-DD');
}


/**
 * Formando numero em valor monetário
 */
function format_currency(number) {
    return Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(number);
}


/**
 * Somar dois valores
 */
function fn_sum(a, b) {
    return a + b
}


/**
 * Media de dois valores
 */
function fn_avg(a, b) {
    return (a + b) / 2;
}


/**
 * Quardando o centro de custo no localstorage
 */
async function setCentroCustoLocalStorage(ref) {
    if (!ref) {
        const arrCC = (await handle_api.getCentrosCusto()).data;
        ref = (arrCC[0] || {}).id;
    }

    if (ref) {
        localStorage.setItem('cc', String(ref));
    }
}


/**
 * Validando campos do formulário com a class 'needs-validation'
 */
function enableValidationForm(form) {
    if (form.checkValidity() === false) {
        form.classList.add('was-validated');
        return false;
    }
    
    return true;
}


/**
 * Limpando validação de formulário
 */
function disenableValidationForm(form) {
    form.classList.remove('was-validated');
}


/**
 * Função retirando validação de formulários do html5
 */
function formNoValidate(el = 'form') {
    document.querySelectorAll(el).forEach(form => {
        form.noValidate = true;
    });
}


/**
 * Função para desabilitando auto complete dos inputs do html5
 */
function formAutoCompleteOff() {
    document.querySelectorAll('input').forEach(e => {
        e.autocomplete = 'off';
    });
}


/**
 * Arredondamento de números
 */
function round(number, decimal) {
    if (typeof number !== "number") return;

    return parseFloat( number.toFixed( decimal ) );
}


/**
 * Logout
 */
async function logout() {
    const response = await handle_api.deleteSession();

    if (response) {
        localStorage.clear();
        location.href = '/login.html';
    }
}


/**
 * Escrevendo texto para filtros a partir de objetos
 */
function object_text(obj) {
    var str = '';

    Object
    .entries(obj)
    .map(([ key, value ]) => {
        if (!value) return;

        switch (key) {
            case 'intervalo':
                str += `De ${ value[0] } até ${ value[1] }`
                break;

            default:
                str += key +': '+ value;
        }

        str += ', ';
    })

    return str.replace(/,\ $/, '');
}


/**
 * Aguardar N tempo antes de executar uma função
 */
const debounce = (fn, wait = 1500, time) => (...args) =>
    clearTimeout(time, time = setTimeout(() => fn(...args), wait));


/**
 * Formatando para cpf ou cnpj
 */
function cpf_or_cnpj_format(str) {
    if (str.length <= 11) {
        return str.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g,"\$1.\$2.\$3\-\$4");
    } else {
        return str.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,"\$1.\$2.\$3\/\$4\-\$5");
    }
}


/**
 * Expressão RegExp para desconsiderar acentos e ç
 */
function escape_accent(str) {
    const accent = ['aáàâåäã', 'eéèêë', 'iíìîï', 'oóòôöõ', 'uúùûü', 'cç', 'nñ'];
    
    accent.forEach(value => {
        const v = `[${ value }]`;
        const p = new RegExp(v, 'gi');

        str = str.replace(p, v);
    }) 

    return str;
}


/**
 * Evento para pré-visualizar idade em campos de data;
 */
function preview_age(strEl) {
    document.querySelectorAll(strEl).forEach(e => {
        e.onblur = function (ev) {
            const age = format_period(Date.now() - Date.parse(ev.target.value + 'T00:00:00'), 'years');
            
            ev.target.nextElementSibling.lastElementChild.textContent = age > 1 ? `${age} anos` : `${age} ano`;
        }
    });
}


/**
 * Removendo propriedades de objetos com valores falsy
 */
function clear_object(o) {
    for (const key in o) {
        if (o.hasOwnProperty(key) && !o[key] && o[key] !== 0) {
            delete o[key];
        }
    }

    return o;
}
