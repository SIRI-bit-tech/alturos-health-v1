"use client"

import { useState, useEffect, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation } from "lucide-react"

interface AddressAutocompleteProps {
  value: string
  onChange: (address: string) => void
  onPlaceSelect?: (place: any) => void
  placeholder?: string
  className?: string
}

interface AddressSuggestion {
  id: string
  description: string
  placeId: string
  types: string[]
}

export function AddressAutocomplete({
  value,
  onChange,
  onPlaceSelect,
  placeholder = "Enter address...",
  className,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Fetch address suggestions from Google Places API
  const fetchSuggestions = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    try {
      // In a real implementation, you would call your backend API which then calls Google Places API
      // For security reasons, never expose your Google API key in the frontend
      const response = await fetch(`/api/places/autocomplete?query=${encodeURIComponent(query)}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.predictions || [])
      } else {
        console.error('Failed to fetch address suggestions')
        setSuggestions([])
      }
    } catch (error) {
      console.error('Error fetching address suggestions:', error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  // Get place details from Google Places API
  const getPlaceDetails = async (placeId: string) => {
    try {
      const response = await fetch(`/api/places/details?place_id=${placeId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        const place = data.result
        
        const formattedAddress = place.formatted_address
        const location = place.geometry?.location
        
        onChange(formattedAddress)
        setSuggestions([])
        
        if (location && onPlaceSelect) {
          onPlaceSelect({
            address: formattedAddress,
            latitude: location.lat,
            longitude: location.lng,
            formattedAddress: formattedAddress,
          })
        }
      } else {
        console.error('Failed to fetch place details')
      }
    } catch (error) {
      console.error('Error fetching place details:', error)
    }
  }

  useEffect(() => {
    if (value.length > 2) {
      setIsLoading(true)
      
      // Fetch real address suggestions from Google Places API
      const fetchSuggestions = async () => {
        try {
          const response = await fetch(`/api/places/autocomplete?query=${encodeURIComponent(value)}`, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
              'Content-Type': 'application/json',
            },
          })
          
          if (response.ok) {
            const data = await response.json()
            setSuggestions(data.predictions || [])
            setShowSuggestions(true)
          } else {
            setSuggestions([])
            setShowSuggestions(false)
          }
        } catch (error) {
          setSuggestions([])
          setShowSuggestions(false)
        } finally {
          setIsLoading(false)
        }
      }
      
      // Debounce the API call
      const timer = setTimeout(fetchSuggestions, 300)
      return () => clearTimeout(timer)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [value])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSuggestionClick = async (suggestion: AddressSuggestion) => {
    onChange(suggestion.description)
    setShowSuggestions(false)
    
    if (onPlaceSelect) {
      try {
        // Fetch real place details from Google Places API via our backend
        const response = await fetch(`/api/places/details?place_id=${suggestion.placeId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
            'Content-Type': 'application/json',
          },
        })
        
        if (response.ok) {
          const placeDetails = await response.json()
          onPlaceSelect(placeDetails.result)
        } else {
          // Fallback to basic suggestion data if API fails
          const fallbackDetails = {
            placeId: suggestion.placeId,
            formattedAddress: suggestion.description,
            geometry: {
              location: {
                lat: 0,
                lng: 0,
              },
            },
          }
          onPlaceSelect(fallbackDetails)
        }
      } catch (error) {
        // Fallback to basic suggestion data if API fails
        const fallbackDetails = {
          placeId: suggestion.placeId,
          formattedAddress: suggestion.description,
          geometry: {
            location: {
              lat: 0,
              lng: 0,
            },
          },
        }
        onPlaceSelect(fallbackDetails)
      }
    }
  }

  const getCurrentLocation = () => {
    if ("geolocation" in navigator) {
      setIsLoading(true)
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          
          try {
            // Reverse geocode the coordinates to get real address
            const response = await fetch(`/api/places/reverse-geocode?lat=${latitude}&lng=${longitude}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                'Content-Type': 'application/json',
              },
            })
            
            if (response.ok) {
              const data = await response.json()
              const address = data.results[0]?.formatted_address || `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
              onChange(address)
              
              if (onPlaceSelect) {
                onPlaceSelect({
                  geometry: {
                    location: { lat: latitude, lng: longitude },
                  },
                  formattedAddress: address,
                })
              }
            } else {
              // Fallback if reverse geocoding fails
              const fallbackAddress = `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
              onChange(fallbackAddress)
              
              if (onPlaceSelect) {
                onPlaceSelect({
                  geometry: {
                    location: { lat: latitude, lng: longitude },
                  },
                  formattedAddress: fallbackAddress,
                })
              }
            }
          } catch (error) {
            // Fallback if API call fails
            const fallbackAddress = `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`
            onChange(fallbackAddress)
            
            if (onPlaceSelect) {
              onPlaceSelect({
                geometry: {
                  location: { lat: latitude, lng: longitude },
                },
                formattedAddress: fallbackAddress,
              })
            }
          }
          
          setIsLoading(false)
        },
        (error) => {
          setIsLoading(false)
        },
      )
    }
  }

  return (
    <div className="relative">
      <div className="flex space-x-2">
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`min-h-[44px] ${className}`}
            autoComplete="off"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="min-h-[44px] px-3 bg-transparent"
          title="Use current location"
        >
          <Navigation className="w-4 h-4" />
        </Button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              type="button"
              className="w-full px-4 py-3 text-left hover:bg-muted/50 transition-colors border-b border-border last:border-b-0 flex items-start space-x-3"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{suggestion.description}</p>
                <p className="text-xs text-muted-foreground">
                  {suggestion.types.includes("street_address") ? "Address" : "Place"}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
