class Despesa{
    constructor(data, tipo, descricao, valor){
        this.data = data;
        this.tipo = tipo;
        this.descricao = descricao;
        this.valor = valor;
    }

    validarDados(){
        for(let i in this){
            if(this[i] == undefined || this[i] == '' || this[i] == null){
                return false;
            }
        }
        return true;
    }
}

class BD{
    constructor(){
        let id = localStorage.getItem('id');

        if(id === null){
            localStorage.setItem('id', 0);
        }
    }

    getProximoId(){
        let proximoId = localStorage.getItem('id');
        return parseInt(proximoId) + 1;
    }

    gravar(despesa){
        let id = this.getProximoId();
        localStorage.setItem(id, JSON.stringify(despesa));
        localStorage.setItem('id', id);
    }

    recuperarTodosRegistros(){
        let despesas = Array();

        for(let a = 0; a <= localStorage.getItem('id'); a++){
            let despesa = JSON.parse(localStorage.getItem(a));
            
            if(despesa === null){
                continue;
            }

            despesa.id = a;
            despesas.push(despesa)
        }

        return despesas;
    }

    pesquisar(despesa){
        let despesasFiltradas = Array();
        despesasFiltradas = this.recuperarTodosRegistros();

        if(despesa.data != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.data == despesa.data);
        }

        if(despesa.tipo != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo);
        }

        if(despesa.descricao != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao);
        }

        if(despesa.valor != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor);
        }
        
        return despesasFiltradas;
    }
    
    excluir(id){
        localStorage.removeItem(id);
    }
}

let bd = new BD();

function cadastrarDespesa(){
    let data = document.getElementById('data');
    let tipo = document.getElementById('tipo');
    let descricao = document.getElementById('descricao');
    let valor = document.getElementById('valor');
    
    let despesa = new Despesa(
        data.value,
        tipo.value,
        descricao.value,
        valor.value
    );

    if(despesa.validarDados() === true){
        bd.gravar(despesa);
        alert('Salvo com Sucesso');

        data.value = '';
        tipo.value = '';
        descricao.value = '';
        valor.value = '';
    }else{
        alert('Dados Inválidos. Existem campos não preenchidos ou preenchidos incorretamente');
    }
}

function carregaListaDespesas(despesas = Array(), filtro = false){
    
    if(despesas.length == 0 && filtro == false){
        despesas = bd.recuperarTodosRegistros();
    }

    let listaDespesas = document.getElementById('listaDespesas');
    listaDespesas.innerHTML = '';

    despesas.forEach(function(despesa){

        let linha = listaDespesas.insertRow();

        let btn = document.createElement("button");
        btn.id = `id_despesa${despesa.id}`;
        btn.innerHTML = 'X';
        btn.onclick = function(){
            
            let id = this.id.replace('id_despesa', '');
            bd.excluir(id);

            carregaListaDespesas();
        }
        btn.className = 'btn roxo icone';
        

        linha.insertCell(0).innerHTML = despesa.data;
        linha.insertCell(1).innerHTML = despesa.tipo;
        linha.insertCell(2).innerHTML = despesa.descricao;
        linha.insertCell(3).innerHTML = despesa.valor;
        linha.insertCell(4).append(btn);
    })
}

function pesquisarDespesa(){
    let data = document.getElementById('data');
    let tipo = document.getElementById('tipo');
    let descricao = document.getElementById('descricao');
    let valor = document.getElementById('valor');

    let despesa = new Despesa(data.value, tipo.value, descricao.value, valor.value);

    let despesas = bd.pesquisar(despesa);

    this.carregaListaDespesas(despesas, true);

}