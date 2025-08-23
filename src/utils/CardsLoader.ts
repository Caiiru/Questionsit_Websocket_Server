import { Card } from "../Cards/Card";
import { Quiz } from "../Quiz/Grasp";
import { Answer, Question } from "../Quiz/models/Question";


export class CardsLoader {

    cardsLoaded:Card[] = [];

    public StartCardLoader():Card[] | null {

        const jsonToLoad = require('../utils/cards.json'); 
        const _cards = this.GetCardsFromJson(jsonToLoad.Cards);
        if (_cards == undefined) { 
            return null;
        } 
        // return null;
        this.cardsLoaded = _cards; 
        return this.cardsLoaded;

    } 

    private GetCardsFromJson(Cards: any) {
        let newCards:Card[] = [];
        for(let i:number = 0; i < Cards.length;i++){
            
            const _newCard:Card = {
                cardID:Cards[i].cardID,
                cardName:Cards[i].cardName,
                cardChance:Cards[i].cardChance,
                cardPW:Cards[i].cardPW,
                cardType:Cards[i].cardType
            }

            // console.log(`new card created: ${JSON.stringify(_newCard)}`);
            newCards.push(_newCard);
        }

        return newCards;
    }
}