import Ledger from "../model/Ledger.js";
import Account from "../model/User.js";

const calculateBalance = async (userId) => {
    const balance = await Ledger.aggregate([
        { $match: { userId } },
        {
            $group: {
                _id: "$userId",
                balance: {
                    $sum: {
                        $cond: [
                            { $eq: ["$type", "CREDIT"] },
                            "$amount",
                            { $multiply: ["$amount", -1] }
                        ]
                    }
                }
            }
        }
    ])

    return balance;
}

const handleGetBalance = async (req, res) => {
    const userId = req.headers["x-user-id"];

    console.log("User ID", userId);
    const balance = await calculateBalance(userId);

    console.log("User Balance : ", balance)


    return res.status(200).json({ balance });


}


const handleCreateAccount = async (req, res) => {
    const userId = req.body.userId;
    const email = req.body.email;
    
    Account.create({ userId, email });
    Ledger.create({
        userId,
        type: "CREDIT",
        amount: 1000,
        referenceType: "USER_CREATED"
    })
}

const hanldeTransferAmount = async (req, res) => {
    const userId = req.user.userId;
    const body = req.body;

    const balance = calculateBalance(userId);

    if (amount <= 0) {
        return res.status(201).json({ message: "Minimum transfer amount is 1rs" });
    }

    if (amount > balance) {
        return res.status(201).json({ message: "Insufficient balance!!" });
    }

    Ledger.create({
        userId,
        type: "DEBIT",
        amount: body.amount,
        referenceType: "TRANSFER",
        referenceId: body.receiverId
    })

    Ledger.create({
        userId: body.receiverId,
        type: "CREDIT",
        amount: body.amount,
        referenceType: "TRANSFER",
        referenceId: userId
    })

    return res.status(200).json({message:"Transaction successful!!"});
}

const handleGetUsers = async (req, res)=>{
    const users = await Account.find();
    

    return res.status(200).json(users);
}

export {
    handleGetBalance,
    handleCreateAccount,
    hanldeTransferAmount,
    handleGetUsers
}