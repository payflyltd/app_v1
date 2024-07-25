import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from '@/context/UserContext';

interface Card {
  id: number;
  bank_name: string;
  card_number: string;
  expiry_month: string;
  expiry_year: string;
  cvv: string;
}

const cardColors: { [key: number]: string } = {
  1: 'bg-blue-500',
  2: 'bg-green-500',
  3: 'bg-pink-500',
  4: 'bg-yellow-500',
  5: 'bg-purple-500',
  // Add more colors as needed
};

const Home = () => {
  const { user } = useUser();
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  useEffect(() => {
    if (user) {
      const fetchCards = async () => {
        try {
          const response = await axios.get(`https://blockchainbinaryopt.shop/payfly/backend/api/get_cards.php?user_id=${user.id}`);
          const fetchedCards = response.data.cards;
          setCards(fetchedCards);

          if (fetchedCards.length > 0) {
            setSelectedCard(fetchedCards[0]); // Set the first card or last used card
          }
        } catch (error) {
          console.error('Error fetching cards:', error);
        }
      };

      fetchCards();
    }
  }, [user]);

  const handleCardSwitch = (card: Card) => {
    setSelectedCard(card);
  };

  if (!user) {
    return <p>Loading...</p>; // Or handle it in a different way
  }

  // Filter the cards to exclude the selected card
  const otherCards = cards.filter(card => card.id !== selectedCard?.id);

  return (
    <div className="mt-5 mx-auto px-4">
      <p className="text-sm text-gray-400 truncate">Welcome Back,</p>
      <h3 className="pt-2 text-xl font-medium text-gray-100">{user.first_name} {user.last_name}</h3>
      
      <div className="mt-8 mx-auto">
        {selectedCard && (
          <div className={`text-white w-80 p-6 rounded-lg shadow-lg transition-transform duration-500 ${cardColors[selectedCard.id % Object.keys(cardColors).length]}`}>
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-semibold">{selectedCard.bank_name}</div>
              <div>
                <img src={`/assets/images/payment-tag.png`} alt="Payment Tag" className="h-10 w-12" />
              </div>
            </div>
            <div className="mb-6">
              <div className="text-lg font-mono tracking-widest">**** **** **** {selectedCard.card_number.slice(-2)}</div>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <div className="text-xs uppercase">Card Holder</div>
                <div className="text-sm font-medium">{user.first_name} {user.last_name}</div>
              </div>
              <div>
                <div className="text-xs uppercase">Expires</div>
                <div className="text-sm font-medium">{selectedCard.expiry_month}/{selectedCard.expiry_year}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-2 mt-8">
        <img src="/assets/images/faceid.png" alt="" className="h-16 w-16 mt-8 mx-auto" />
        <p>Tap and Pay</p>
      </div>

      <div className="mt-8 relative w-full h-64">
        {/* Render cards that are not selected, stacked in the background */}
        {otherCards.map((card, index) => (
          <div
            key={card.id}
            className={`absolute w-80 p-4 rounded-lg shadow-lg ${cardColors[card.id % Object.keys(cardColors).length]} transition-transform duration-500 ease-in-out`}
            style={{ 
              top: '45%', 
              left: '50%', 
              transform: `translate(-50%, -50%) translateX(${index * 40}px)`, 
              zIndex: cards.length - index // Ensure cards stack correctly
            }}
          >
            <button
              onClick={() => handleCardSwitch(card)}
              className="w-full h-full flex flex-col justify-center items-center"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="text-lg font-semibold">{card.bank_name}</div>
                <div>
                  <img src={`/assets/images/payment-tag.png`} alt="Payment Tag" className="h-8 w-10" />
                </div>
              </div>
              <div className="text-sm text-gray-400 truncate">**** **** **** {card.card_number.slice(-2)}</div>
            </button>
          </div>
        ))}
        {/* Render the selected card on top */}
        {selectedCard && (
          <div
            className={`absolute w-80 p-4 rounded-lg shadow-lg ${cardColors[selectedCard.id % Object.keys(cardColors).length]} transition-transform duration-500 ease-in-out z-10 transform scale-105`}
            style={{ 
              top: '29%', 
              left: '30%', 
              transform: 'translate(-50%, -50%)', 
            }}
          >
            <button
              onClick={() => handleCardSwitch(selectedCard)}
              className="w-full h-full flex flex-col justify-center items-center"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="text-lg font-semibold">{selectedCard.bank_name}</div>
                <div>
                  <img src={`/assets/images/payment-tag.png`} alt="Payment Tag" className="h-8 w-10" />
                </div>
              </div>
              <div className="text-sm text-gray-400 truncate">**** **** **** {selectedCard.card_number.slice(-2)}</div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
