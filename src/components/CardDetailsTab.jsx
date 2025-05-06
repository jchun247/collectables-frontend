import PropTypes from 'prop-types';
import { formatCardFinish, formatCardCondition, formatCardRarity, formatCardSubtype, formatModifier, formatCardText } from '@/utils/textFormatters';
import energyTypeImages from '@/utils/energyTypeImages';

const CardDetailsTab = ({ cardDetails }) => {
  return (
    <div className="space-y-4">
      {cardDetails.prices && cardDetails.prices.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Market Price</h3>
          <div className="space-y-3">
            {[...cardDetails.prices].sort((a, b) => {
              const finishPriority = {
                HOLOFOIL: 4,
                NORMAL: 3,
                REVERSE_HOLO: 2,
                STAMP: 1
              };
              return (finishPriority[b.finish] || 0) - (finishPriority[a.finish] || 0);
            }).map((price, index) => (
              <div key={index} className="border rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="font-medium">{formatCardFinish(price.finish)}</div>
                    <div className="text-sm text-muted-foreground">{formatCardCondition(price.condition)}</div>
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
                    <img
                      key={costItem.id}
                      src={energyTypeImages[costItem.cost]}
                      alt={costItem.cost}
                      className="w-6 h-6"
                    />
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

      <div className="mt-4 border-t border-border py-4">
        <div className="grid grid-cols-2 gap-6 text-sm">
          {cardDetails.pokemonDetails && Object.keys(cardDetails.pokemonDetails).length > 0 && (
            <>
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">
                  {(cardDetails.pokemonDetails.types?.length || 0) > 1 ? 'Types' : 'Type'}
                </span>
                <div className="font-medium flex items-center gap-2">
                  {cardDetails.pokemonDetails.types?.length ? (
                    <div className="flex flex-col space-y-1">
                      {cardDetails.pokemonDetails.types.map((t, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <img 
                            src={energyTypeImages[t.type]} 
                            alt={t.type} 
                            className="w-5 h-5"
                          />
                          <span className="pl-1">{formatCardText(t.type)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    'N/A'
                  )}
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">HP</span>
                <span className="font-medium">
                  {cardDetails.pokemonDetails.hitPoints || 'N/A'}
                </span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Weakness</span>
                <div className="font-medium flex items-center gap-2">
                  {cardDetails.pokemonDetails.weakness?.weaknessType ? (
                    <div className="flex items-center gap-2">
                      <img 
                        src={energyTypeImages[cardDetails.pokemonDetails.weakness.weaknessType]} 
                        alt={cardDetails.pokemonDetails.weakness.weaknessType} 
                        className="w-5 h-5"
                      />
                      <span>
                        {formatModifier(cardDetails.pokemonDetails.weakness.weaknessModifier)}
                        {cardDetails.pokemonDetails.weakness.weaknessValue}
                      </span>
                    </div>
                  ) : (
                    'N/A'
                  )}
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Resistance</span>
                <div className="font-medium flex items-center gap-2">
                  {cardDetails.pokemonDetails.resistance?.resistanceType ? (
                    <div className="flex items-center gap-2">
                      <img 
                        src={energyTypeImages[cardDetails.pokemonDetails.resistance.resistanceType]} 
                        alt={cardDetails.pokemonDetails.resistance.resistanceType} 
                        className="w-5 h-5"
                      />
                      <span>
                        {formatModifier(cardDetails.pokemonDetails.resistance.resistanceModifier)}
                        {cardDetails.pokemonDetails.resistance.resistanceValue}
                      </span>
                    </div>
                  ) : (
                    'N/A'
                  )}
                </div>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-sm text-muted-foreground">Retreat Cost</span>
                <div className="font-medium flex gap-1">
                  {cardDetails.pokemonDetails.retreatCost ? (
                    Array(cardDetails.pokemonDetails.retreatCost)
                      .fill(0)
                      .map((_, index) => (
                        <img
                          key={index}
                          src={energyTypeImages['COLORLESS']}
                          alt="Colorless Energy"
                          className="w-5 h-5"
                        />
                      ))
                  ) : (
                    'N/A'
                  )}
                </div>
              </div>
            </>
          )}
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">
              Tags
            </span>
            <span className="font-medium">
              {cardDetails.subTypes?.length
                ? cardDetails.subTypes.map(subType => formatCardSubtype(subType)).join(', ')
                : 'N/A'}
            </span>
          </div>
          <div className="flex flex-col space-y-1">
            <span className="text-sm text-muted-foreground">
              Illustrated By
            </span>
            <button className="font-medium hover:text-blue-500 hover:underline transition-colors text-left w-full">
              {cardDetails.illustratorName || 'N/A'}
            </button>
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
              {formatCardRarity(cardDetails.rarity) || 'N/A'}
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
