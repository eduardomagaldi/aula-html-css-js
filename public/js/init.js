function init() {
    const animais = getAnimals()

    const index = getRandomArbitrary(0, animais.length)
    const suggestedName = capitalizeFirstLetter(animais[index])

    const input = document.querySelector('.input')
    input.value = suggestedName

    const form = document.querySelector('.overlay')
    form.addEventListener('submit', (e) => {
        e.preventDefault()
        form.classList.add('hide')

        const input = document.querySelector('#name').value

        let name = get('name')
        if (!name) {
            save('name', input)
            uuid = get('uuid')
        }

        let uuid = get('uuid')
        if (!uuid) {
            save('uuid', createUUID())
            uuid = get('uuid')
        }

        setTimeout(() => {
            form.classList.add('d-none')
        }, 300)
    })
}

function getRandomArbitrary(min, max) {
    return Math.round(Math.random() * (max - min) + min)
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
}

function createUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
            var r = (Math.random() * 16) | 0,
                v = c == 'x' ? r : (r & 0x3) | 0x8
            return v.toString(16)
        },
    )
}

function getAnimals() {
    return [
        //a
        'abelha',
        'abutre',
        'água-viva',
        'águia',
        'albatroz',
        'alce',
        'alpaca',
        'anaconda',
        'anchova',
        'andorinha',
        'antílope',
        'aranha',
        'arara',
        'arraia',
        'atum',
        'avestruz',
        //b
        'babuíno',
        'bacalhau',
        'bagre',
        'baiacu',
        'barata',
        'beija-flor',
        'bem-te-vi',
        'besouro',
        'bicho-preguiça',
        'bode',
        'boto',
        'búfalo',
        //c
        'cabra',
        'cabrito',
        'cacatua',
        'cachorro',
        'calango',
        'camaleão',
        'camarão',
        'camelo',
        'camundongo',
        'canário',
        'canguru',
        'capivara',
        'caracol',
        'caramujo',
        'caranguejo',
        'carneiro',
        'cascavel',
        'castor',
        'cavalo',
        'cavalo-marinho',
        'cegonha',
        'centopeia',
        'chimpanzé',
        'chinchila',
        'chita',
        'cigarra',
        'cisne',
        'coala',
        'cobra',
        'codorna',
        'coelho',
        'coiote',
        'coral',
        'coruja',
        'corvo',
        'crocodilo',
        'cupim',
        'curió',
        //d
        'diabo-da-tasmânia',
        'dinossauro',
        'doninha',
        'dragão-de-komodo',
        'dromedário',
        //e
        'elefante',
        'ema',
        'enguia',
        'escorpião',
        'esponja',
        'esquilo',
        'estrela-do-mar',
        //f
        'falcão',
        'faisão',
        'flamingo',
        'foca',
        'formiga',
        'furão',
        //g
        'gafanhoto',
        'gaivota',
        'ganso',
        'galo',
        'gambá',
        'garça',
        'gato',
        'gavião',
        'gibão',
        'girafa',
        'golfinho',
        'gorila',
        'gralha',
        'grilo',
        'guaxinim',
        'guepardo',
        //h
        'hamster',
        'hiena',
        'hipopótamo',
        //i
        'iguana',
        //j
        'jabuti',
        'jacaré',
        'javali',
        'jiboia',
        'joaninha',
        'joão-de-barro',
        //l
        'lagartixa',
        'lagarto',
        'lagosta',
        'lambari',
        'leão',
        'leão-marinho',
        'lebre',
        'lêmure',
        'leopardo',
        'lhama',
        'libélula',
        'lince',
        'linguado',
        'lobo',
        'lontra',
        'louva-a-deus',
        //m
        'mamute',
        'marimbondo',
        'mariposa',
        'marisco',
        'maritaca',
        'marreco',
        'mexilhão',
        'mico',
        'minhoca',
        'morcego',
        'morsa',
        'mosca',
        'mosquito',
        //n
        'naja',
        'namorado',
        //o
        'onça',
        'orangotango',
        'orca',
        'ornitorrinco',
        'ostra',
        'ouriço',
        'ouriço-do-mar',
        'ovelha',
        //p
        'paca',
        'panda',
        'pantera',
        'papagaio',
        'pardal',
        'pássaro',
        'pato',
        'pavão',
        'peixe',
        'peixe-boi',
        'pelicano',
        'percevejo',
        'periquito',
        'pernilongo',
        'pinguim',
        'piolho',
        'pombo',
        'polvo',
        'pônei',
        'porco',
        'porco-espinho',
        'porquinho-da-índia',
        'preá',
        'pulga',
        'puma',
        //q
        'quati',
        'quero-quero',
        //r
        'rã',
        'raposa',
        'ratazana',
        'rato',
        'rêmora',
        'rena',
        'rinoceronte',
        'robalo',
        'rouxinol',
        //s
        'sabiá',
        'salamandra',
        'salmão',
        'sapo',
        'sardinha',
        'serpente',
        'siri',
        'suricato',
        //t
        'tamanduá',
        'tarântula',
        'tartaruga',
        'tatu',
        'texugo',
        'tico-tico',
        'tigre',
        'tilápia',
        'touro',
        'traça',
        'truta',
        'tubarão',
        'tucano',
        'tuiuiú',
        //u
        'urso',
        //v
        'vaga-lume',
        'vespa',
        'viúva-negra',
        //z
        'zangão',
        'zebra',
        'zebu',
    ]
}
