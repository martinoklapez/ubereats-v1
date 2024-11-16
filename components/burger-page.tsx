'use client'

import Image from "next/image"
import { Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

const scrollbarHideClass = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

export function BurgerPage() {
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [orderStep, setOrderStep] = useState<'review' | 'details' | 'confirmation'>('review')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  const burgerItems = [
    { id: 1, name: "Hamburger", rating: "1", price: "€8,50", bestseller: false },
    { id: 2, name: "Cheeseburger", rating: "2", price: "€9,50", bestseller: true },
    { id: 3, name: "Bacon Burger", rating: "3", price: "€9,50", bestseller: false },
    { id: 4, name: "Bacon Cheeseburger", rating: "4", price: "€10,50", bestseller: false },
    { id: 5, name: "Little Hamburger", rating: "5", price: "€6,50", bestseller: false },
    { id: 6, name: "Little Cheeseburger", rating: "6", price: "€7,50", bestseller: false },
    { id: 7, name: "Little Bacon Burger", rating: "7", price: "€7,50", bestseller: false },
    { id: 8, name: "Little Bacon Cheeseburger", rating: "8", price: "€8,50", bestseller: false },
  ]

  const friesItems = [
    { id: 9, name: "Little Five Guys Style Fries", rating: "1", price: "€5,75", bestseller: false },
    { id: 10, name: "Five Guys Style Fries", rating: "2", price: "€8,50", bestseller: true },
    { id: 11, name: "Large Five Guys Style Fries", rating: "3", price: "€9,95", bestseller: false },
    { id: 12, name: "Little Cajun Fries", rating: "4", price: "€5,75", bestseller: false },
    { id: 13, name: "Cajun Fries", rating: "5", price: "€8,50", bestseller: false },
    { id: 14, name: "Large Cajun Fries", rating: "6", price: "€9,95", bestseller: false },
  ]

  const drinksItems = [
    { id: 15, name: "Coca-Cola Classic 0,5l", rating: "1", price: "€4,00", bestseller: true },
    { id: 16, name: "Fanta 0,5l", rating: "2", price: "€4,00", bestseller: false },
    { id: 17, name: "Sprite 0,5l", rating: "3", price: "€4,00", bestseller: false },
    { id: 18, name: "Vio Water 0,5l", rating: "4", price: "€4,00", bestseller: false },
    { id: 19, name: "Fuze Tea Pfirsich 0,4l", rating: "5", price: "€4,00", bestseller: false },
    { id: 20, name: "Fuze Tea Zitrone Zitronengras 0,4l", rating: "6", price: "€4,00", bestseller: false },
  ]

  const toggleItemSelection = (id: number) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const handleOrder = async () => {
    if (orderStep === 'review') {
      setOrderStep('details')
      return
    }

    if (orderStep === 'details') {
      setOrderStep('confirmation')
    }
  }

  const submitOrder = async () => {
    const selectedItemsAll = burgerItems.concat(friesItems).concat(drinksItems).filter(item => selectedItems.includes(item.id))
    const total = selectedItemsAll.reduce((sum, item) => sum + parseFloat(item.price.slice(1).replace(",", ".")), 0).toFixed(2)

    const queryParams = new URLSearchParams({
      brand: "UberEats",
      customerName: name,
      customerPhone: phone,
      notes: message || "Bitte ohne Zwiebeln",
      items: JSON.stringify(selectedItemsAll.map(item => ({
        name: item.name,
        price: item.price.slice(1).replace(",", "."),
        amount: 1
      }))),
      total: total,
      status: "1",
      createdAt: Date.now().toString(),
      updatedAt: Date.now().toString()
    })

    try {
      const response = await fetch(`https://webhook.site/26e6296a-5f6d-41e1-82d2-dd7ae47d44db${queryParams.toString()}`, {
        method: 'GET',
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      console.log('Order placed successfully')
    } catch (error) {
      console.error('Error placing order:', error)
    }
  }

  useEffect(() => {
    if (orderStep === 'confirmation') {
      submitOrder()
    }
  }, [orderStep])

  const resetOrder = () => {
    setSelectedItems([])
    setName('')
    setPhone('')
    setMessage('')
    setOrderStep('review')
    setIsModalOpen(false)
  }

  const selectedItemsAll = burgerItems.concat(friesItems).concat(drinksItems).filter(item => selectedItems.includes(item.id))
  const total = selectedItemsAll.reduce((sum, item) => sum + parseFloat(item.price.slice(1).replace(",", ".")), 0).toFixed(2)

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <style jsx global>{scrollbarHideClass}</style>
      <header className="sticky top-0 z-10 bg-[#06C167] px-4 py-4 flex justify-center items-center h-16">
        <h1 className="text-2xl text-black">
          <span className="font-normal">UberX</span><span className="font-bold">Eats</span>
        </h1>
      </header>
      <main className="flex-grow overflow-y-auto">
        <div className="w-full max-w-4xl mx-auto px-4 lg:px-0">
          <div className="relative h-48 w-full lg:h-[300px] lg:max-w-4xl lg:mx-auto">
            <Image
              alt="Burger hero image"
              className="object-cover w-full h-full lg:rounded-b-lg"
              src="https://imageproxy.wolt.com/mes-image/0f638a07-f49d-472c-af26-61dae87b8620/2d2960a2-6170-4931-b93e-a6939337949a"
              width={896}
              height={300}
              priority
            />
          </div>
          <div className="mt-4">
            <h2 className="mb-4 text-2xl font-bold">Burger</h2>
            <div className="flex gap-4 overflow-x-auto lg:flex-wrap lg:justify-start -mx-4 px-4 scrollbar-hide mb-4">
              {burgerItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`relative w-[140px] flex-shrink-0 overflow-hidden cursor-pointer rounded-lg m-1 ${
                    selectedItems.includes(item.id) ? 'ring-2 ring-[#06C167]' : ''
                  }`}
                  onClick={() => toggleItemSelection(item.id)}
                >
                  <Card className="h-full">
                    <div className="relative h-[100px] w-full">
                      <Image
                        alt={item.name}
                        className="object-cover"
                        fill
                        src="/placeholder.svg?height=200&width=200"
                      />
                      <button
                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-md bg-white shadow-md"
                        aria-label={`Add ${item.name} to order`}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleItemSelection(item.id)
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      {item.bestseller && (
                        <span className="absolute left-2 top-2 inline-block rounded-md bg-[#E6F7F1] px-2 py-1 text-xs text-[#06C167]">
                          Bestseller
                        </span>
                      )}
                    </div>
                    <div className="p-2 flex flex-col h-[120px]">
                      <p className="text-sm font-medium truncate mt-3">{item.name}</p>
                      <p className="text-sm font-medium text-black mt-2">{item.name}</p>
                      <p className="text-sm font-medium mt-auto">{item.price}</p>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <h2 className="mb-4 text-2xl font-bold">Fries</h2>
            <div className="flex gap-4 overflow-x-auto lg:flex-wrap lg:justify-start -mx-4 px-4 scrollbar-hide mb-4">
              {friesItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`relative w-[140px] flex-shrink-0 overflow-hidden cursor-pointer rounded-lg m-1 ${
                    selectedItems.includes(item.id) ? 'ring-2 ring-[#06C167]' : ''
                  }`}
                  onClick={() => toggleItemSelection(item.id)}
                >
                  <Card className="h-full">
                    <div className="relative h-[100px] w-full">
                      <Image
                        alt={item.name}
                        className="object-cover"
                        fill
                        src="/placeholder.svg?height=200&width=200"
                      />
                      <button
                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-md bg-white shadow-md"
                        aria-label={`Add ${item.name} to order`}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleItemSelection(item.id)
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      {item.bestseller && (
                        <span className="absolute left-2 top-2 inline-block rounded-md bg-[#E6F7F1] px-2 py-1 text-xs text-[#06C167]">
                          Bestseller
                        </span>
                      )}
                    </div>
                    <div className="p-2 flex flex-col h-[120px]">
                      <p className="text-sm font-medium truncate mt-3">{item.name}</p>
                      <p className="text-sm font-medium text-black mt-2">{item.name}</p>
                      <p className="text-sm font-medium mt-auto">{item.price}</p>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <h2 className="mb-4 text-2xl font-bold">Drinks</h2>
            <div className="flex gap-4 overflow-x-auto lg:flex-wrap lg:justify-start -mx-4 px-4 scrollbar-hide mb-4">
              {drinksItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`relative w-[140px] flex-shrink-0 overflow-hidden cursor-pointer rounded-lg m-1 ${
                    selectedItems.includes(item.id) ? 'ring-2 ring-[#06C167]' : ''
                  }`}
                  onClick={() => toggleItemSelection(item.id)}
                >
                  <Card className="h-full">
                    <div className="relative h-[100px] w-full">
                      <Image
                        alt={item.name}
                        className="object-cover"
                        fill
                        src="/placeholder.svg?height=200&width=200"
                      />
                      <button
                        className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-md bg-white shadow-md"
                        aria-label={`Add ${item.name} to order`}
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleItemSelection(item.id)
                        }}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      {item.bestseller && (
                        <span className="absolute left-2 top-2 inline-block rounded-md bg-[#E6F7F1] px-2 py-1 text-xs text-[#06C167]">
                          Bestseller
                        </span>
                      )}
                    </div>
                    <div className="p-2 flex flex-col h-[120px]">
                      <p className="text-sm font-medium truncate mt-3">{item.name}</p>
                      <p className="text-sm font-medium text-black mt-2">{item.name}</p>
                      <p className="text-sm font-medium mt-auto">{item.price}</p>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <div className="sticky bottom-0 left-0 right-0 bg-white p-4 shadow-lg h-20 flex items-center justify-center">
        <div className="w-full max-w-4xl px-4 lg:px-0">
          <Button 
            className="w-full bg-black text-white hover:bg-black/90"
            onClick={() => setIsModalOpen(true)}
            disabled={selectedItems.length === 0}
          >
            Warenkorb öffnen
          </Button>
        </div>
      </div>
      <Dialog open={isModalOpen} onOpenChange={(open) => {
        if (!open) resetOrder()
      }}>
        <DialogContent className="rounded-lg sm:max-w-[425px] w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {orderStep === 'review' ? 'Warenkorb' : 
               orderStep === 'details' ? 'Bestelldetails' : 
               'Bestellung bestätigt'}
            </DialogTitle>
          </DialogHeader>
          <div className="min-h-[300px] flex flex-col">
            {orderStep === 'review' && (
              <div className="flex-1">
                {selectedItemsAll.map((item) => (
                  <div key={item.id} className="flex justify-between items-center mb-2">
                    <span>{item.name}</span>
                    <span>{item.price}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center font-bold mt-4 pt-2 border-t">
                  <span>Gesamt</span>
                  <span>€{total}</span>
                </div>
              </div>
            )}
            {orderStep === 'details' && (
              <div className="flex-1 space-y-4">
                <Input
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <Input
                  placeholder="Telefonnummer"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
                <Textarea
                  placeholder="Bestellnachricht"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            )}
            {orderStep === 'confirmation' && (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <Check className="w-16 h-16 text-green-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Vielen Dank für Ihre Bestellung!</h3>
                <p className="mb-4">Ihre Bestellung wurde erfolgreich aufgegeben und wird in Kürze bearbeitet.</p>
                <div className="w-full text-left">
                  <h4 className="font-semibold mb-2">Bestelldetails:</h4>
                  {selectedItemsAll.map((item) => (
                    <div key={item.id} className="flex justify-between items-center mb-2">
                      <span>{item.name}</span>
                      <span>{item.price}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center font-bold mt-4 pt-2 border-t">
                    <span>Gesamt</span>
                    <span>€{total}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            {orderStep === 'confirmation' ? (
              <Button onClick={resetOrder}>
                Schließen
              </Button>
            ) : (
              <Button onClick={handleOrder}>
                {orderStep === 'review' ? 'Weiter' : 'Jetzt bestellen'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}