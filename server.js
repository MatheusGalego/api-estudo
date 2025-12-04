import 'dotenv/config'
import express from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const app = express(); // Padrao para inicar o servidor a partir da constante app

app.use(express.json()); // Por padrao o node nao usa JSON, nessa linha a gente garante que ele vai usar

app.post('/users', async (req, res) => { // Tudo que passa com req, sao coisas que vem da request, e no res, o que o servidor vai retornar a partir da req

    const {email, name, age} = req.body;

    if (!email || email.trim() === "") {
        return res.status(400).json({messagem: "O e-mail é obrigatório e não pode estar em branco"})
    }

    if (!name || name.trim() === "") {
        return res.status(400).json({messagem: "O nome é obrigatório e não pode estar em branco"})
    }

    if (!age) {
        return res.status(400).json({messagem: "A idade é obrigatória"})
    }

    try {
        await prisma.user.create({
            data: {
                email: email,
                name: name,
                age: age
            }
        });

        res.status(201).json(req.body);

    } catch (error) {

        res.status(500).json({ message: "Erro ao criar usuário" });
    }
})

app.get('/users', async (req, res /* requisicao, resposta */) => {

    let users = [];

    if (req.query){
        users = await prisma.user.findMany ({
            where: {
                name: req.query.name,
                age: req.query.age,
                email: req.query.email
            }
        })
    } else {
        users = await prisma.user.findMany();
    }



    res.status(200).json(users); // 200 diz que tudo deu certo, e retorna a lista de objetos salva na const users 

})

app.put('/users/:id', async (req, res) => {
    
    const {email, name, age} = req.body;

    if (!email || email.trim() === "") {
        return res.status(400).json({message: "O e-mail é obrigatório e não pode estar em branco"})
    }

    if (!name || name.trim() === "") {
        return res.status(400).json({message: "O nome é obrigatório e não pode estar em branco"})
    }

    if (!age || typeof age !== "number") {
        return res.status(400).json({message: "A idade é obrigatória e deve ser um número"})
    }

    try{
        await prisma.user.update ({
            where: {
                id: req.params.id
            },
            data:{
                email: email,
                name: name,
                age: age
            }
        });

        res.status(201).json(req.body);

    } catch (error) {
        res.status(500).json({error: "Erro ao atualizar usuario"});
    }

})

app.delete('/users/:id', async (req, res) => {

    await prisma.user.delete({

        where: {
            id: req.params.id
        }

    })

    res.status(201).json({message: "Usuário deletado com sucesso"});

})


app.listen(3000);

