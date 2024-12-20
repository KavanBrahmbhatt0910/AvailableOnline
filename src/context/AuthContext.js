import { CognitoUser, AuthenticationDetails, } from "amazon-cognito-identity-js";
import { createContext, useState } from "react";
import UserPool from "../Aws/UserPool";

const AuthContext = createContext();

const AuthProvider = (props) => {


    const login = async(email,password)=>{
        return await new Promise((resolve,reject)=>{
         console.log(email,password);
            
         const user = new CognitoUser({
                email,
                UserPool
            });
            
        const authDetails = new AuthenticationDetails({
                email,
                password
            });
            
        user.authenticateUser(authDetails,{
                onSuccess:data=>{
                    console.log('onSuccess:',data);
                    resolve(data);
                },
                onFailure:err=>{
                    reject(err);
                },
                newPasswordRequired:data=>{
                    console.log('newPasswordRequired:',data);
                    resolve(data);
                }
            });
        });
     }
 
}

export {AuthContext,AuthProvider};