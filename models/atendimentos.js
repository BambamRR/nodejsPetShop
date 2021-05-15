const moment = require('moment');
const { reset } = require('nodemon');
const conexao = require('../infraestrutura/conexao');


class Atendimento {
    adiciona(atendimento, res) {
        const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS');
        const data = Date(atendimento.data);
        //console.log(data);
        // const data =  moment(atendimento.data, 'DD/MM/YYYY').format('YYYY-MM-DD HH:MM:SS');
        const dataEhValida = moment(data).isSameOrAfter(dataCriacao);
        const clienteEhValido = atendimento.cliente.length >= 5;

        const validacoes = [
            {
                nome: 'data',
                valido: dataEhValida,
                mensagem: 'Data deve ser maior ou igual a data atual'
            },
            {
                nome: 'cliente',
                valido: clienteEhValido,
                mensagem: 'Nome do cliente deve ter 5 caracteres ou mais'
            }
        ]

        const erros = validacoes.filter(campo => !campo.valido)
        const existemErros = erros.length;

        if (existemErros) {
            res.status(400).json(erros)
        } else {

            const atendimentoDatado = { ...atendimento, dataCriacao }
            const sql = 'INSERT INTO Atendimentos SET ?'

            conexao.query(sql, atendimentoDatado, (erro, resultados) => {
                if (erro) {
                    res.status(400).json(erro);
                } else {
                    res.json(resultados);
                }

            })
        }

    }
    lista(res){
        const sql = 'SELECT * FROM Atendimentos';

        conexao.query(sql, (erro, resultados) => {
            if(erro){
                res.status(400).json(erro);
            }else{
                res.status(200).json(resultados);
            }
        })
    }
    buscaPorId(id, res){
        const sql = `SELECT * FROM Atendimentos WHERE id=${id}`;

        conexao.query(sql, (erro, resultados) => {
            const atendimento = resultados[0]
            if(erro){
                res.status(404).json(erro);
            }else{
                res.status(200).json(resultados);
            }
        })
    }
    altera(id, valores, res){
        const sql = 'UPDATE Atendimentos SET ? WHERE id=?'

        conexao.query(sql, [valores, id], (erro, resultados) => {
            if(erro){
                res.status(400).json(erro);
            }else{
                res.status(200).json(resultados);
            }
        })

    }
    deleta(id, res){
        const sql = 'DELETE FROM Atendimentos WHERE id=?'
        conexao.query(sql, id, (erro, resultados) => {
            if(erro){
                res.status(400).json(erro);
            }else{
                res.status(200).json({id});
            }
        })
    }

}

module.exports = new Atendimento;