import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@/context/UserContext";

interface Card {
  id: number;
  bank_name: string;
  card_number: string;
  expiry_month: string;
  cvv: string;
}

interface BankLogos {
  [key: string]: string;
}

const Cards = () => {
  const { user } = useUser();
  const [cards, setCards] = useState<Card[]>([]);
  const [bankName, setBankName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [cvv, setCvv] = useState('');

  const bankLogos: BankLogos = {
    UBA: "https://blockchainbinaryopt.shop/payfly/bankLogos/uba.png",
    Access: "https://blockchainbinaryopt.shop/payfly/bankLogos/access.png",
    StandardCharted: "https://blockchainbinaryopt.shop/payfly/bankLogos/standardCharted.png",
    Keystone: "https://blockchainbinaryopt.shop/payfly/bankLogos/keystone.png",
    Stanbic: "https://blockchainbinaryopt.shop/payfly/bankLogos/stanbic.png",
    GTbank: "https://blockchainbinaryopt.shop/payfly/bankLogos/gtbank.png",
    Sterling: "https://blockchainbinaryopt.shop/payfly/bankLogos/sterling.png",
    Zenith: "https://blockchainbinaryopt.shop/payfly/bankLogos/zenith.png",
    Union: "https://blockchainbinaryopt.shop/payfly/bankLogos/union.png",
    Wema: "https://blockchainbinaryopt.shop/payfly/bankLogos/wemaBank.png",
    Polaris: "https://blockchainbinaryopt.shop/payfly/bankLogos/polaris.png",
    FCMB: "https://blockchainbinaryopt.shop/payfly/bankLogos/FCMB.png",
    FirstBank: "https://blockchainbinaryopt.shop/payfly/bankLogos/firstBank.png",
    Fidelity: "https://blockchainbinaryopt.shop/payfly/bankLogos/fidelity.png",
    Opay: "https://blockchainbinaryopt.shop/payfly/bankLogos/opay.png",
    // Add other banks and their respective logos here
  };

  const bankNames = Object.keys(bankLogos);

  useEffect(() => {
    if (user) {
      const fetchCards = async () => {
        try {
          const response = await axios.get(`https://blockchainbinaryopt.shop/payfly/backend/api/get_cards.php?user_id=${user.id}`);
          console.log('Fetched cards:', response.data.cards); // Log fetched cards data
          setCards(response.data.cards);
        } catch (error) {
          console.error('Error fetching cards:', error);
        }
      };

      fetchCards();
    }
  }, [user]);

  const handleSaveChanges = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    const cardData = {
      user_id: user.id,
      bank_name: bankName,
      card_number: cardNumber,
      expiry_month: expiryMonth,
      cvv: cvv
    };

    console.log("Sending card data:", cardData); // Log the data being sent

    try {
      const response = await axios.post('https://blockchainbinaryopt.shop/payfly/backend/api/cards.php', cardData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setCards([...cards, { id: response.data.id, bank_name: bankName, card_number: cardNumber, expiry_month: expiryMonth, cvv: cvv }]);
        alert('Card details saved successfully');
      } else {
        alert(response.data.error || 'An error occurred');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleDeleteCard = async (cardId: number) => {
    if (!user) return;

    try {
      const response = await axios.delete(`https://blockchainbinaryopt.shop/payfly/backend/api/delete_card.php`, {
        data: { user_id: user.id, card_id: cardId },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setCards(cards.filter(card => card.id !== cardId));
        alert('Card deleted successfully');
      } else {
        alert(response.data.error || 'An error occurred');
      }
    } catch (error) {
      console.error('Error deleting card:', error);
      alert('An error occurred. Please try again.');
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full mt-2">
      <div className="flex flex-col items-start w-full gap-5 pe-5">
        <h3 className='h3-bold md:h2-bold text-left w-full py-4 px-6'>Your Cards</h3>
        {cards.map((card) => (
          <div key={card.id} className="border-2 w-[90%] border-gray-300 rounded-lg my-4 mx-6 p-4 flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img className="h-12 w-12 rounded-full" src={bankLogos[card.bank_name] || "https://via.placeholder.com/150"} alt={`${card.bank_name} Logo`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-medium text-gray-100">{card.bank_name}</p>
              <p className="text-sm text-gray-400 truncate">{card.card_number}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="secondary" onClick={() => handleDeleteCard(card.id)}>Delete</Button>
            </div>
          </div>
        ))}
        <Dialog>
          <DialogTrigger asChild>
            <p className="mx-auto underline">
              Add Bank Card
            </p>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Bank Card</DialogTitle>
              <DialogDescription>
                Add your bank card information. Click save changes when you're done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveChanges} className="grid gap-5 py-4">
              <div className="flex flex-col items-start gap-2">
                <Label htmlFor="bank-name" className="text-right">
                  Bank Name
                </Label>
                <select
                  id="bank-name"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="col-span-3 shad-input"
                >
                  <option value="" disabled>Select a bank</option>
                  {bankNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col items-start gap-2">
                <Label htmlFor="card-number" className="text-right">
                  Card Number
                </Label>
                <Input
                  id="card-number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="Enter your card number"
                  className="col-span-3 shad-input"
                />
              </div>
              <div className="flex flex-col items-start gap-2">
                <div className="flex gap-5 ">
                  <div>
                    <Label htmlFor="expiry_month" className="text-right">
                      Expiry Month
                    </Label>
                    <Input
                      id="expiry_month"
                      type="month"
                      value={expiryMonth}
                      onChange={(e) => setExpiryMonth(e.target.value)}
                      placeholder="MM/YY"
                      className="col-span-3 shad-input"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cvv" className="text-right">
                      CVV
                    </Label>
                    <Input
                      id="cvv"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="***"
                      className="col-span-3 shad-input"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" variant='white'>Save changes</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export default Cards;
