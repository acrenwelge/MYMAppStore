import React, { useEffect, useState } from 'react';
import {readBook} from "../../api/read";
import { getUserSubscriptions } from "../../api/user";
import { Subscription } from "../../entities";
import {Container, Icon, Message} from "semantic-ui-react";

interface IframeProps {
    src: string;
    title: string;
    width: string;
    height: string;
    allowFullscreen?: boolean;
    frameBorder?: number;
}

function getLink(name: string): string {
	switch (name) {
        case "Calculus":
            return "";
		case "MYMACalc1":
			return "MYMACalc1" + "/MContents.html";
		case "MYMACalc2":
			return "MYMACalc2" + "/MContents.html";
		case "MYMACalc3":
			return "MYMACalc3" + "/MContents.html";
		case "M4C":
			return "M4C" + "/MapletsForCalculus.html";
		default:
			return "matthew";
	}
}


const ReadBookPage: React.FC = (props): JSX.Element | null => {
    const [loading,setLoading] = useState<boolean>(false)
    const [src, setSrc] = useState<string|undefined>("");

    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

    useEffect(() => {
        getUserSubscriptions()
            .then(res => {
                // conversion from string to date must be done manually
                setSubscriptions(res.data.map((sub: Subscription) => {
                    sub.expirationDate = new Date(sub.expirationDate); 
                    return sub
                }));
                setLoading(false)
            })
            .catch(error => {
                console.error(error)
                setLoading(false)
            });
    }, []);


    useEffect(()=> {
        // setLoading(true);
        // getUserSubscriptions()
        // .then(res => {
        //     // conversion from string to date must be done manually
        //     setSubscriptions(res.data.map((sub: Subscription) => {
        //         sub.expirationDate = new Date(sub.expirationDate); 
        //         return sub
        //     }));
        //     setLoading(false)
        // })
        // .catch(error => {
        //     console.error(error)
        //     setLoading(false)
        // });
        readBook().then((res)=>{
            setSrc(res.data.readValidation.bookURL);
            setLoading(false);
        }).catch((error)=> {
            setSrc(undefined);
            setLoading(false);
        })
    },[])

    if (loading) {
        return (
            <Container>
                <Message icon
                size='massive'>
                <Icon name='circle notched' loading />
                <Message.Content>
                    <Message.Header>Checking</Message.Header>
                    Checking for your purchasing record and email subscription
                </Message.Content>
            </Message>
            </Container>
        )
    }

    else {
        return (

            src !== undefined ?
                <div>
                    <iframe style={{width:'100vw', height:'90vh', overflowY:'auto',border:'0px'}} src={src}></iframe>
                </div>:
                <Container>
                    <Message icon='meh outline'
                             size='massive'
                             negative
                             header='Sorry'
                             content='You can&#39;t read the book now. Please purchase it first or check your email address.
                    '>
                    </Message>
                </Container>

        )
    }





}

export default ReadBookPage;
