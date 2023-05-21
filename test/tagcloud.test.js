const { assert } = require('chai');

const { extractTags, findKFrequentTags, updatefrequency } = require('../utils/tagCloud.js');

describe('extractTags', () => {
    it('should return an null for a string without tags', () => {
        const string = 'This is a string without tags';
        const result = extractTags(string);
        assert.deepStrictEqual(result, null);
    });

    it('should extract single tag from the string', () => {
        const string = 'This is a string with #tag';
        const result = extractTags(string);
        assert.deepStrictEqual(result, ["#tag"]);
    });

    it('should extract multiple tags from the string', () => {
        const string = 'This is a string with #tag1, #tag2, and #tag3';
        const result = extractTags(string);
        assert.deepStrictEqual(result, ["#tag1", "#tag2", "#tag3"]);
    });

    it('should extract tags from tags with special characters', () => {
        const string = 'This is a string with #tag_world and #tag?';
        const result = extractTags(string);
        assert.deepStrictEqual(result, ["#tag_world", "#tag"]);
    });
});


describe('findKFrequentTags', () => {
    it('should return an empty array for an empty tags object', () => {
        const tags = {};
        const k = 3;
        const result = findKFrequentTags(tags, k);
        assert.deepStrictEqual(result, []);
    });

    it('should return the k most frequent tags', () => {
        const tags = {
            '#tag1': 3,
            '#tag2': 5,
            '#tag3': 2,
            '#tag4': 7,
            '#tag5': 1
        };
        const k = 3;
        const result = findKFrequentTags(tags, k);
        assert.deepStrictEqual(result, [
            { tag: '#tag4', frequency: 7 },
            { tag: '#tag2', frequency: 5 },
            { tag: '#tag1', frequency: 3 }
        ]);
    });

    it('should return all tags if k is greater than or equal to the number of tags', () => {
        const tags = {
            '#tag1': 3,
            '#tag2': 5,
            '#tag3': 2
        };
        const k = 5;
        const result = findKFrequentTags(tags, k);
        assert.deepStrictEqual(result, [
            { tag: '#tag2', frequency: 5 },
            { tag: '#tag1', frequency: 3 },
            { tag: '#tag3', frequency: 2 }
        ]);
    });

    it('should handle duplicate frequencies correctly', () => {
        const tags = {
            '#tag1': 3,
            '#tag2': 5,
            '#tag3': 5,
            '#tag4': 7,
            '#tag5': 1
        };
        const k = 3;
        const result = findKFrequentTags(tags, k);
        assert.deepInclude(result, { tag: '#tag4', frequency: 7 });
        assert.deepInclude(result, { tag: '#tag2', frequency: 5 });
        assert.deepInclude(result, { tag: '#tag3', frequency: 5 });
    });
});


describe('updatefrequency', () => {
  it('should update tag frequencies correctly when tags exist', () => {
    const data = {
      content: 'This is a sample #tag content',
      like_count: 5,
      retweet_count: 3
    };
    const tagFrequency = {};
    const tagFrequencyWithLikesAndRetweets = {};

    updatefrequency(data, tagFrequency, tagFrequencyWithLikesAndRetweets);

    assert.deepStrictEqual(tagFrequency, { '#tag': 1 });
    assert.deepStrictEqual(tagFrequencyWithLikesAndRetweets, { '#tag': 8 });
  });

  it('should update tag frequencies correctly when tags do not exist', () => {
    const data = {
      content: 'This is a sample content without tags',
      like_count: 2,
      retweet_count: 1
    };
    const tagFrequency = {};
    const tagFrequencyWithLikesAndRetweets = {};

    updatefrequency(data, tagFrequency, tagFrequencyWithLikesAndRetweets);

    assert.deepStrictEqual(tagFrequency, { '#notag': 1 });
    assert.deepStrictEqual(tagFrequencyWithLikesAndRetweets, { '#notag': 3 });
  });

  it('should handle multiple tags correctly', () => {
    const data = {
      content: 'This #tag1 is a sample #tag2 content with multiple tags',
      like_count: 4,
      retweet_count: 2
    };
    const tagFrequency = {};
    const tagFrequencyWithLikesAndRetweets = {};

    updatefrequency(data, tagFrequency, tagFrequencyWithLikesAndRetweets);

    assert.deepStrictEqual(tagFrequency, { '#tag1': 1, '#tag2': 1 });
    assert.deepStrictEqual(tagFrequencyWithLikesAndRetweets, { '#tag1': 6, '#tag2': 6 });
  });

});
