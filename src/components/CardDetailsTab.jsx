import PropTypes from 'prop-types';

const CardDetailsTab = ({ cardDetails }) => {
  return (
    <div className="space-y-6">
      {cardDetails.prices && cardDetails.prices.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Market Price</h3>
          <div className="space-y-3">
            {cardDetails.prices.map((price, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="font-medium">{price.finish}</div>
                    <div className="text-sm text-muted-foreground">{price.condition}</div>
                  </div>
                  <div className="text-lg font-semibold text-green-500">
                    ${price.price.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {cardDetails.pokemonDetails?.abilities && cardDetails.pokemonDetails.abilities.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Abilities</h3>
          <div className="space-y-3">
            {cardDetails.pokemonDetails.abilities.sort((a, b) => a.id - b.id).map((ability) => (
              <div key={ability.id} className="border rounded-lg p-3">
                <div className="flex items-center">
                  <span className="font-medium">{ability.name}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{ability.text}</p>
              </div>
            ))}
          </div>
        </div>  
      )}

      {cardDetails.pokemonDetails?.attacks && cardDetails.pokemonDetails.attacks.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Attacks</h3>
          <div className="space-y-3">
            {cardDetails.pokemonDetails.attacks.sort((a, b) => a.id - b.id).map((attack) => (
              <div key={attack.id} className="border rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{attack.name}</span>
                  <span>{attack.damage}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{attack.text}</p>
                <div className="mt-1 flex gap-1">
                  {attack.cost?.sort((a, b) => a.id - b.id).map((costItem) => (
                    <span key={costItem.id} className="text-xs bg-primary/10 px-2 py-1 rounded">
                      {costItem.cost}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {cardDetails.rules && cardDetails.rules.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Rules</h3>
          <div className="space-y-3">
            {cardDetails.rules.sort((a, b) => a.id - b.id).map((rule) => (
              <div key={rule.id} className="border rounded-lg p-3">
                <p className="text-sm text-muted-foreground">{rule.text}</p>
              </div>
            ))}
          </div>
        </div>  
      )}

      <div className="mt-6 border-t border-border py-6">
        <div className="grid grid-cols-2 gap-6 text-sm">
          {cardDetails.pokemonDetails && Object.keys(cardDetails.pokemonDetails).length > 0 && (
            <>
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">
                  {(cardDetails.pokemonDetails.types?.length || 0) > 1 ? 'Types' : 'Type'}
                </span>
                <span className="font-medium">
                  {cardDetails.pokemonDetails.types?.length
                    ? cardDetails.pokemonDetails.types.map(t => t.type).join(', ')
                    : 'N/A'}
                </span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">HP</span>
                <span className="font-medium">
                  {cardDetails.pokemonDetails.hitPoints || 'N/A'}
                </span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Weakness</span>
                <span className="font-medium">
                  {cardDetails.pokemonDetails.weakness?.weaknessType
                    ? `${cardDetails.pokemonDetails.weakness.weaknessType} (×${
                        cardDetails.pokemonDetails.weakness.weaknessValue
                      })`
                    : 'N/A'}
                </span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Resistance</span>
                <span className="font-medium">
                  {cardDetails.pokemonDetails.resistance?.weaknessType
                    ? `${cardDetails.pokemonDetails.resistance.weaknessType} (x${
                        cardDetails.pokemonDetails.resistance.weaknessValue
                      })`
                    : 'N/A'}
                </span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Retreat Cost</span>
                <span className="font-medium">
                  {cardDetails.pokemonDetails.retreatCost || 'N/A'}
                </span>
              </div>
            </>
          )}
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">
              Tags
            </span>
            <span className="font-medium">
              {cardDetails.subTypes?.length
                ? cardDetails.subTypes.join(', ')
                : 'N/A'}
            </span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">
              Illustrated By
            </span>
            <span className="font-medium">
              {cardDetails.illustratorName || 'N/A'}
            </span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">
              Release Date
            </span>
            <span className="font-medium">
              {cardDetails.releaseDate || 'N/A'}
            </span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">
              Rarity
            </span>
            <span className="font-medium">
              {cardDetails.rarity || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

CardDetailsTab.propTypes = {
  cardDetails: PropTypes.object.isRequired,
};

export default CardDetailsTab;
