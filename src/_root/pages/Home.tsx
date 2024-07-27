import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from '@/context/UserContext';
import Modal from 'react-modal';

interface Card {
  id: number;
  bank_name: string;
  card_number: string;
  expiry_month: string;
  expiry_year: string;
  cvv: string;
}

const cardColors = ['bg-blue-500', 'bg-green-500', 'bg-pink-500', 'bg-yellow-500', 'bg-purple-500'];

const Home = () => {
  const { user } = useUser();
  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardColorMap, setCardColorMap] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    if (user) {
      const fetchCards = async () => {
        try {
          const response = await axios.get(`https://blockchainbinaryopt.shop/payfly/backend/api/get_cards.php?user_id=${user.id}`);
          const fetchedCards: Card[] = response.data.cards;
          setCards(fetchedCards);

          if (fetchedCards.length > 0) {
            setSelectedCard(fetchedCards[0]); // Set the first card or last used card
          }

          // Assign colors to cards
          const colorMap: { [key: number]: string } = {};
          let availableColors = [...cardColors];

          fetchedCards.forEach(card => {
            if (availableColors.length === 0) {
              availableColors = [...cardColors]; // Reset available colors if exhausted
            }
            const colorIndex = Math.floor(Math.random() * availableColors.length);
            colorMap[card.id] = availableColors.splice(colorIndex, 1)[0];
          });

          setCardColorMap(colorMap);
        } catch (error) {
          console.error('Error fetching cards:', error);
        }
      };

      fetchCards();
    }
  }, [user]);

  const handleCardSwitch = (card: Card) => {
    setSelectedCard(card);
    setIsModalOpen(false);
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
          <div className={`text-white w-80 p-6 rounded-lg shadow-lg transition-transform duration-500 ${cardColorMap[selectedCard.id]}`}>
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
            </div>
          </div>
        )}
      </div>

      <p className="underline pt-3 pl-2" onClick={() => setIsModalOpen(true)}>
        Switch Account
      </p>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        contentLabel="Select a Card"
        className="bg-black rounded-lg p-8 shadow-lg max-w-md mx-auto my-8"
        overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <h2 className="text-xl mb-2">Select a Card</h2>
        <div className="space-y-4">
          {otherCards.map((card: Card) => (
            <div
              key={card.id}
              className={`text-white w-full p-4 rounded-lg shadow-lg ${cardColorMap[card.id]} cursor-pointer`}
              onClick={() => handleCardSwitch(card)}
            >
              <div className="flex justify-between items-center mb-2">
                <div className="text-lg font-semibold">{card.bank_name}</div>
                <div>
                  <img src={`/assets/images/payment-tag.png`} alt="Payment Tag" className="h-8 w-10" />
                </div>
              </div>
              <div className="text-sm text-gray-400 truncate">**** **** **** {card.card_number.slice(-2)}</div>
            </div>
          ))}
        </div>
      </Modal>

      <div className="flex flex-col items-center gap-2 mt-8">
        <img src="/assets/images/faceid.png" alt="" className="h-16 w-16 mt-8 mx-auto" />
        <p>Tap to Pay</p>
      </div>
    </div>
  );
}

export default Home;
