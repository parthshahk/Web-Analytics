switch(window.location.hash){
    case "#logout": 
        M.toast({html: 'Logout Successfully'})
        break;

    case "#userExists":
        M.toast({html: 'User Already Exists'})
        break;

    case "#incorrectPassword":
        M.toast({html: 'Incorrect Password'})
        break;

    case "#userDoesNotExist":
        M.toast({html: 'User Does Not Exist'})
        break;
}