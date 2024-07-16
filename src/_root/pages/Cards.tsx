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

const Cards = () => {
  const { user } = useUser();
  const [cards, setCards] = useState<Card[]>([]);
  const [bankName, setBankName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [cvv, setCvv] = useState('');

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

    try {
      const response = await axios.post('https://blockchainbinaryopt.shop/payfly/backend/api/cards.php', {
        user_id: user.id,
        bank_name: bankName,
        card_number: cardNumber,
        expiry_month: expiryMonth,
        cvv: cvv
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
              <img className="h-12 w-12 rounded-full" src="https://via.placeholder.com/150" alt="Bank Profile Picture" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-lg font-medium text-gray-100">{card.bank_name}</p>
              <p className="text-sm text-gray-400 truncate">{card.card_number}</p>
            </div>
            <div>
              <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
              </svg>
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
                <Input
                  id="bank-name"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="Enter bank name here..."
                  className="col-span-3 shad-input"
                />
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
