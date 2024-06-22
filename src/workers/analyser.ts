import Sentiment from 'sentiment';
import { syllable } from 'syllable';
// @ts-expect-error text-readability is untyped
import rs from 'text-readability';

const sentiment = new Sentiment();

self.addEventListener('message', (event) => {
  const text = event.data.text;

  const lines = text.split('\n');
  const chars = text.replace(/\n/g, '').split('');
  const readability = rs.fleschReadingEase(text);

  self.postMessage({
    chars: chars.length,
    words: rs.lexiconCount(text),
    lines: lines.length,
    syllables: syllable(text),
    sentiment: sentiment.analyze(text),
    readability:
      readability > 90
        ? 'Very Easy'
        : readability > 80
        ? 'Easy'
        : readability > 70
        ? 'Fairly Easy'
        : readability > 60
        ? 'Standard'
        : readability > 50
        ? 'Fairly Difficult'
        : readability > 30
        ? 'Difficult'
        : 'Very Confusing',
  });
});
