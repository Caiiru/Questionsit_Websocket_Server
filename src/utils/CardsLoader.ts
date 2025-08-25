import { Card, CardChance, CardType } from "../Cards/Card";
import { AddPointsStrategy } from "../Cards/Strategys/AddPointsStrategy";
import { ClearStrategy } from "../Cards/Strategys/ClearStrategy";
import { DoublePointStrategy } from "../Cards/Strategys/PointStrategy";
import { Quiz } from "../Quiz/Grasp";
import { Answer, Question } from "../Quiz/models/Question";


export class CardsLoader {

    cardsLoaded: Card[] = [];

    public StartCardLoader(): Card[] | null {

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
        let newCards: Card[] = [];
        for (let i: number = 0; i < Cards.length; i++) {

            const _newCard: Card = {
                cardID: Cards[i].cardID,
                cardName: Cards[i].cardName,
                cardChance: Cards[i].cardChance,
                cardPW: Cards[i].cardPW,
                cardType: Cards[i].cardType,
                effect: undefined,
            }

            // console.log(`new card created: ${JSON.stringify(_newCard)}`);
            newCards.push(_newCard);
        }

        return newCards;
    }

    public createCards(): Map<number, Card> {

        let cardMap: Map<number, Card> = new Map();

        cardMap.set(0, {
            cardID: 0,
            cardName: "Double Points",
            cardPW: 2,
            cardType: CardType.Delayed,
            cardChance: CardChance.Medium,
            effect: new DoublePointStrategy()
        });
        cardMap.set(1, {
            cardID: 1,
            cardName: "Single Drop",
            cardPW: 3,
            cardType: CardType.Delayed,
            cardChance: CardChance.High,
            effect: new AddPointsStrategy(100)
        });

        cardMap.set(2, {
            cardID: 2,
            cardName: "Clear lv1",
            cardPW: 2,
            cardType: CardType.Instant,
            cardChance: CardChance.Medium,
            effect: new ClearStrategy()
        });

        // console.log(cardMap.get(2));

        // cardMap.set(1, {
        //     cardID: 1,
        //     cardName: "Diminuir Velocidade",
        //     cardPW: 1,
        //     cardType: CardType.Delayed,
        //     cardChance: CardChance.High,
        //     effect: new Diminuir()
        // });

        // cardMap.set(2, {
        //     cardID: 2,
        //     cardName: "Aumento de Pontos",
        //     cardPW: 3,
        //     cardType: CardType.Instant,
        //     cardChance: CardChance.Low,
        //     effect: new AumentarPontos()
        // });

        return cardMap;
    }
}