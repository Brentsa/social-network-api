const {User} = require('../models');

const userController = {

    //Get all users in the database
    getAllUsers(req, res){
        User.find({})
        .then(dbUserData => res.json(dbUserData))
        .catch(error => res.status(500).json(error));
    },

    //Get a single user in the database using their id
    getSingleUser({params}, res){
        User.findById(params.id).populate('thoughts', '-__v').populate('friends', '-__v').select('-__v')
        .then(dbUserData => {
            if(!dbUserData) 
                return res.status(404).json({message: 'No user found with this id.'})
            else 
                return res.json(dbUserData);    
        })
        .catch(error => res.status(500).json(error));
    },

    //Create a user
    createUser({body}, res){
        User.create(body)
        .then(dbUserData => res.json(dbUserData))
        .catch(error => res.status(500).json(error));
    },

    //Update a user based on their id
    updateUser({params, body}, res){
        User.findByIdAndUpdate(params.id, body, {new: true, runValidators: true})
        .then(dbUserData => {
            if(!dbUserData)
                return res.status(404).json({message: "No user found with this id."})
            else   
                return res.json(dbUserData);
        })
        .catch(error => res.status(500).json(error));
    },

    //Delete a user from the database using their id
    deleteUser({params}, res){
        User.findByIdAndDelete(params.id)
        .then(dbUserData => {
            if(!dbUserData)
                return res.status(404).json({message: "No user found with this id."})
            else   
                return res.json(dbUserData);
        })
        .catch(error => res.status(500).json(error));
    },

    //Add a friend to the user
    addFriend({params}, res){
        User.findById(params.friendId)
        .then(dbFriendData => {
            if(!dbFriendData){
                return res.status(404).json({message: "Friend ID not found."})
            }
            
            User.findByIdAndUpdate(
                params.userId,
                {$addToSet: {friends: dbFriendData._id}},
                {new: true, runValidators: true}
            )
            .then(dbUserData => !dbUserData ? res.status(404).json({message: "No user found with this id."}) : res.json(dbUserData))
        })
        .catch(error => res.status(500).json(error));
    },

    deleteFriend({params}, res){
        User.findById(params.friendId)
        .then(dbFriendData => {
            if(!dbFriendData){
                return res.status(404).json({message: "Friend ID not found."})
            }

            User.findByIdAndUpdate(
                params.userId,
                {$pull: {friends: dbFriendData._id}},
                {new: true}
            )
            .then(dbUserData => !dbUserData ? res.status(404).json({message: "No user found with this id."}) : res.json(dbUserData))
        })
        .catch(error => res.status(500).json(error));
    }
}

module.exports = userController;