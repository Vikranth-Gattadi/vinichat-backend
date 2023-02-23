import express from 'express';
import mongoose from 'mongoose';
import Cors from "cors";
import Users from "./dbmodel.js";
import Accounts from "./login/loginmodel.js";

const app = express();
const port = 5329;
const conn_url = "mongodb+srv://vikranth:1853@clust1.1pmkoau.mongodb.net/vinichat_users?retryWrites=true&w=majority"
const defaultBackImg = "https://t4.ftcdn.net/jpg/03/87/75/31/360_F_387753109_0xjbgmibs2VrN34VrNYPMjVn883yB632.jpg"


app.use(express.json())
app.use(Cors())

mongoose.connect(conn_url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})


app.get('/', (req, res) => res.status(200).send("Hello nithin boys!!!!...."))

app.post("/vinichat/adduser", (req, res) => {
    const dbUser = req.body;

    Users.create(dbUser, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    })
})

app.put("/vinichat/addmessage", (req, res) => {
    const dbChat = req.body;
    const query = { mobile: dbChat.mobile, "chats.chat_mobile": dbChat.chat_mobile };
    if (dbChat.message_data.type === "") {
        Users.findOne(query).exec().then((result) => {
            if (result === null) {
                const query = { mobile: dbChat.mobile };
                const chat_data = {
                    "chat_name": dbChat.chat_name,
                    "chat_mobile": dbChat.chat_mobile,
                    "ImgUrl": dbChat.ImgUrl,
                    "backGroundImg": defaultBackImg,
                    "messages": [],
                }
                const updateDocument = {
                    $push: { "chats": chat_data }
                };
                Users.updateOne(query, updateDocument).exec().then((result) => {
                    console.log(result);
                }).catch((err) => {
                    res.status(500).send(err);
                })
            }
            const updateDocument = {
                $push: { "chats.$.messages": dbChat.message_data },
                $set: { "chats.$.ImgUrl": dbChat.ImgUrl }
            };
            Users.updateOne(query, updateDocument).exec().then((result) => {
                res.status(200).send(result);
            }
            ).catch((err) => {
                res.status(500).send(err);
            });
        }).catch((err) => {
            res.status(500).send(err);
        })
    } else {
        const updateDocument = {
            $push: { "chats.$.messages": dbChat.message_data },
            $set: { "chats.$.ImgUrl": dbChat.ImgUrl }
        };
        Users.updateOne(query, updateDocument).exec().then((result) => {
            res.status(200).send(result);
        }
        ).catch((err) => {
            res.status(500).send(err);
        });
    }   
})

app.get("/vinichat/users", (req, res) => {
    Users.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(200).send(data);
        }
    })
});

app.post("/vinichat/createuser", (req, res) => {
    const dbUser = req.body;
    Users.create(dbUser, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            const account = {
                user: data.user,
                mobile: dbUser.mobile,
                password: dbUser.password,
                user_id: data._id
            }
            Accounts.create(account, (err, data) => {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.status(201).send(data);
                }
            })
        }
    })

})

app.post("/vinichat/loginuser", (req, res) => {
    const dbUser = req.body;
    Accounts.findOne({ "mobile": dbUser.mobile, "password": dbUser.password }, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            if (data === null) {
                res.status(404).send("no data found");
            } else {
                Users.findOne({ "_id": data.user_id }, (err, data) => {
                    if (err) {
                        res.status(500).send(err);
                    } else {
                        res.status(200).send(data);
                    }
                })
            }
        }
    })
})

app.post("/vinichat/changeimage", (req, res) => {
    const dbUser = req.body;
    const query = { user: dbUser.user, mobile: dbUser.mobile };
    const updateDocument = {
        $set: { "ImgUrl": dbUser.imgurl }
    };
    Users.updateOne(query, updateDocument).exec().then((result) => {
        Accounts.updateOne(query, updateDocument).exec().then((result) => {
            res.status(202).send(result);
        }
        ).catch((err) => {
            res.status(500).send(err);
        });
    }
    ).catch((err) => {
        res.status(500).send(err);
    });
})

app.post("/vinichat/finduser", (req, res) => {
    const dbUser = req.body;
    if (dbUser.searchUser) {
        Users.findOne({ "mobile": dbUser.mobile }, (err, data) => {
            if (err) {
                res.status(500).send(err);
            } else {
                if (data === null) {
                    res.status(200).send({ "code": "404", "data": "No data found" });
                } else {
                    res.status(200).send(data);
                }
            }
        })
    } else {
        Accounts.findOne({ "mobile": dbUser.mobile }, (err, data) => {
            if (err) {
                res.status(500).send(err);
            } else {
                if (data === null) {
                    res.status(200).send({ "code": "404", "data": "No data found" });
                } else {
                    res.status(200).send(data);
                }
            }
        })
    }
})

app.post("/vinichat/addchat", (req, res) => {
    const dbUser = req.body;
    const query = { mobile: dbUser.mobile };
    const updateDocument = {
        $push: { "chats": dbUser.details }
    };
    Users.updateOne(query, updateDocument).exec().then((result) => {
        res.status(200).send("done");
    }).catch((err) => {
        res.status(500).send(err);
    })
})

//listner
app.listen(port, () => console.log(`listening on localhost:${port}`));