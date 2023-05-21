const fs = require('fs');
const csv = require('csv-parser');
const Heap = require('heap');

/**
 * Extracts tags from a string.
 * @param {string} string - The input string to extract tags from.
 * @returns {Array<string>} - An array of tags extracted from the string.
*/
module.exports.extractTags = (string) => {
  const pattern = /#\w+/g;
  // const pattern = /#[^\s]+/g; 
  const tags = string.match(pattern);
  return tags;
}

/**
 * Finds the threshold most frequent tags from the given tags object.
 *
 * @param {Object} tags - An object containing tags and their frequencies.
 * @param {number} threshold - The number of most frequent tags to find.
 * @returns {Array} - An array of tag-frequency pairs representing the threshold most frequent tags.
 */
module.exports.findKFrequentTags = (tags, threshold) => {
  // Create a min heap to store the tag-frequency pairs
  const minHeap = new Heap((a, b) => a.frequency - b.frequency);

  // Iterate over the tags object
  for (const tag in tags) {
    const frequency = tags[tag];
    minHeap.push({ tag, frequency });

    // If the heap size exceeds threshold, remove the least frequent tag
    if (minHeap.size() > threshold) {
      minHeap.pop();
    }
  }

  const kMostFrequentTags = minHeap.toArray();
  kMostFrequentTags.sort((a, b) => b.frequency - a.frequency);

  return kMostFrequentTags;
}

/**
 * Updates the tag frequencies based on the provided data.
 *
 * @param {Object} data - The data containing content and other information.
 * @param {Object} tagFrequency - The tag frequency object to update.
 * @param {Object} tagFrequencyWithLikesAndRetweets - The tag frequency with likes and retweets object to update.
 */
module.exports.updatefrequency = (data, tagFrequency, tagFrequencywithlikesAndRetweets) => {
  const content = data.content;
  let tags = this.extractTags(content);

  if (!tags) { 
    tags = ["#notag"] 
  };

  tags.forEach(tag => {
    // lowercasing tags .. so that #CHATGPT, #chatgpt , #chatGPT will come under one bracket.
    tag = tag.toLowerCase();

    // Updating tag Frequency...
    tagFrequency[tag] = (tagFrequency[tag]) ? tagFrequency[tag] + 1 : 1;

    // Updating tag Frequency which has like_count and retweet_count 
    const likesAndRetweets = parseInt(data.like_count) + parseInt(data.retweet_count);
    tagFrequencywithlikesAndRetweets[tag] = (tagFrequencywithlikesAndRetweets[tag]) ? tagFrequencywithlikesAndRetweets[tag] + likesAndRetweets : likesAndRetweets;
  });
}

/**
 * Generates tag clouds response which contain threshold no of tags with highest frequency.
 *
 * @param {number} threshold - The frequency threshold for tag inclusion in the tag clouds.
 * @returns {Promise<Object>} - A promise that resolves to an object with tag clouds.
 */
module.exports.genearteTagclouds = (threshold) => {
  const tagFrequency = {};
  const tagFrequencywithlikesAndRetweets = {};

  return new Promise((resolve, reject) => {
    // Read the CSV file
    fs.createReadStream('./tweetsData.csv')
    .pipe(csv())
    .on('data', (data) => {
      this.updatefrequency(data,tagFrequency,tagFrequencywithlikesAndRetweets);
    })
    .on('end', () => {
      resolve( {
        tagFrequency: this.findKFrequentTags(tagFrequency, threshold),
        tagFrequencywithlikesAndRetweets: this.findKFrequentTags(tagFrequencywithlikesAndRetweets, threshold)
      });
    })
    .on("error", error => reject(error));
  });

}


