import HoverRevealCards, { type CardItem } from '@/components/ui/cards';

// Sample data for the demo, matching the structure of the CardItem interface.
const demoItems: CardItem[] = [
  {
    id: 1,
    title: 'Echoes',
    subtitle: 'Grand Canyon',
    imageUrl: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    title: 'Highest Mountain',
    subtitle: 'Yosemite',
    imageUrl: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    title: 'Deep Desert',
    subtitle: 'Sahara',
    imageUrl: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    title: 'Breath-taking',
    subtitle: 'Landscape',
    imageUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=800&q=80',
  },
];

/**
 * A demo page to showcase the HoverRevealCards component.
 */
export const HoverRevealCardsDemo = () => {
  return (
    // Centering the component for a clean preview.
    // `bg-background` ensures it adapts to the current theme (light/dark).
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <HoverRevealCards items={demoItems} />
    </div>
  );
};

export default HoverRevealCardsDemo;
