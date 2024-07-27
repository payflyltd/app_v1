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
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

    setIsLoading(true);

    const cardData = {
      user_id: user.id,
      bank_name: bankName,
      card_number: cardNumber,
      expiry_month: expiryMonth,
      cvv: cvv
    };

    try {
      const response = await axios.post('https://blockchainbinaryopt.shop/payfly/backend/api/cards.php', cardData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setCards([...cards, { id: response.data.id, bank_name: bankName, card_number: cardNumber, expiry_month: expiryMonth, cvv: cvv }]);
       // Reset form fields
      setBankName('');
      setCardNumber('');
      setExpiryMonth('');
      setCvv('');
        setIsDialogOpen(false); // Close the modal
      } else {
        alert(response.data.error);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCard = async (cardId: number) => {
    if (!user) return;

    setIsLoading(true);

    try {
      const response = await axios.delete(`https://blockchainbinaryopt.shop/payfly/backend/api/delete_card.php`, {
        data: { user_id: user.id, card_id: cardId },
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setCards(cards.filter(card => card.id !== cardId));
      } else {
        alert(response.data.error);
      }
    } catch (error) {
      console.error('Error deleting card:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="w-full mt-2">
      <div className="flex flex-col items-start w-full gap-5 pe-5">
        <h3 className='h5-bold md:h2-bold text-left w-full py-4 px-6'>Your Cards</h3>
        {cards.map((card) => (
          <div key={card.id} className="border-2 w-[90%] border-gray-100 rounded-lg my-0.2 mx-5 p-4 flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img className="h-12 w-12 rounded-full" src={bankLogos[card.bank_name] || "default-logo.png"} alt={card.bank_name} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-medium text-white-900 truncate">
                {card.bank_name}
              </p>
              <p className="text-sm text-gray-500 truncate">
                *****************************
              </p>
            </div>
            <div>
              <Button onClick={() => handleDeleteCard(card.id)} disabled={isLoading}>
                {isLoading ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="m-5">Add Card</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add a new card</DialogTitle>
            <DialogDescription>
              Enter your card details here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveChanges}>
            <div className="flex flex-col gap-4 py-4">
              <div className="grid w-full items-center gap-4">
                <Label htmlFor="bank_name">Bank Name</Label>
                <select
                  id="bank_name"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="p-2 border border-gray-300 rounded bg-gray-800 text-white"
                >
                  <option value="">Select Bank</option>
                  {bankNames.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid w-full items-center gap-4">
                <Label htmlFor="card_number">Card Number</Label>
                <Input
                  id="card_number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="bg-gray-800 text-white"
                />
              </div>
              <div className="grid w-full items-center gap-4">
                <Label htmlFor="expiry_month">Expiry Month</Label>
                <Input
                  id="expiry_month"
                  value={expiryMonth}
                  type="month"
                  onChange={(e) => setExpiryMonth(e.target.value)}
                  className="bg-gray-800 text-white"
                />
              </div>
              <div className="grid w-full items-center gap-4">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value)}
                  className="bg-gray-800 text-white"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isLoading} className="bg-gray-700 text-white">
                {isLoading ? 'Saving...' : 'Add Card'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Cards;
