const fs = require('fs');

let _seed = undefined;

function seed(s) {
    _seed = s % 2147483647;
    if (_seed <= 0) _seed += 2147483646;
}

function random() {
    _seed = (_seed * 1103515245 + 12345) % 2147483647;
    return _seed / 2147483647;
}

function randrange(max) {
    if (_seed === undefined) {
        throw new Error("PRNG not seeded. Call seed() first.");
    }
    return Math.floor(random() * max);
}


function load_csv(filename) {
    const file = fs.readFileSync(filename, 'utf8');
    const lines = file.trim().split('\n');
    const dataset = lines.map(line => line.split(','));
    return dataset;
}

function strColumnToFloat(dataset, column) {
    for (let row of dataset) {
        row[column] = parseFloat(row[column].trim());
    }
}

function crossValidationSplit(dataset, n_folds) {
    const dataset_split = [];
    let dataset_copy = Array.from(dataset);
    const fold_size = Math.floor(dataset.length / n_folds);
    for (let i = 0; i < n_folds; i++) {
        const fold = [];
        while (fold.length < fold_size) {
            const index = randrange(dataset_copy.length);
            fold.push(dataset_copy.splice(index, 1)[0]);
        }
        dataset_split.push(fold);
    }
    return dataset_split;
}

function accuracyMetric(actual, predicted) {
    let correct = 0;
    for (let i = 0; i < actual.length; i++) {
        if (actual[i] === predicted[i]) {
            correct += 1;
        }
    }
    return correct / parseFloat(actual.length) * 100.0;
}

function evaluateAlgorithm(dataset, algorithm, n_folds, ...args) {
    const folds = crossValidationSplit(dataset, n_folds);
    const scores = [];
    for (let i = 0; i < folds.length; i++) {
        const fold = folds[i];
        let train_set = [];
        for (let j = 0; j < folds.length; j++) {
            if (i !== j) {
                train_set = train_set.concat(folds[j]);
            }
        }

        const test_set = [];
        for (let row of fold) {
            let row_copy = Array.from(row);
            test_set.push(row_copy);
            row_copy[row_copy.length - 1] = null;
        }
        const predicted = algorithm(train_set, test_set, ...args);
        const actual = fold.map(row => row[row.length - 1]);
        const accuracy = accuracyMetric(actual, predicted);
        scores.push(accuracy);
    }
    return scores;
}

function testSplit(index, value, dataset){
    let left = [];
    let right = [];
    for(let i = 0; i < dataset.length; ++i){
        let row = dataset[i];
        if (row[index] < value){
            left.push(row);
        }else{
            right.push(row);
        }
    }
    let res = [];
    res.push(left);
    res.push(right);
    return res;
}

function giniIndex(groups, classes) {
    const n_instances = groups.reduce((sum, group) => sum + group.length, 0);
    let gini = 0.0;
    for (const group of groups) {
        const size = group.length;
        if (size === 0) {
            continue;
        }
        let score = 0.0;
        for (const classVal of classes) {
            const p = group.filter(row => row[row.length - 1] === classVal).length / size;
            score += p * p;
        }
        gini += (1.0 - score) * (size / n_instances);
    }
    return gini;
}

function getSplit(dataset) {
    const classValues = [...new Set(dataset.map(row => row[row.length - 1]))];
    let bIndex = 999, bValue = 999, bScore = 999, bGroups = null;

    for (let index = 0; index < dataset[0].length - 1; index++) {
        for (const row of dataset) {
            const groups = testSplit(index, row[index], dataset);
            const gini = giniIndex(groups, classValues);
            if (gini < bScore) {
                bIndex = index;
                bValue = row[index];
                bScore = gini;
                bGroups = groups;
            }
        }
    }
    return { index: bIndex, value: bValue, groups: bGroups };
}

function toTerminal(group) {
    const outcomes = group.map(row => row[row.length - 1]);
    return outcomes.sort((a, b) =>
        outcomes.filter(v => v === a).length - outcomes.filter(v => v === b).length
    ).pop();
}

function split(node, maxDepth, minSize, depth) {
    const [left, right] = node.groups;
    delete node.groups;
    if (!left.length || !right.length) {
        node.left = toTerminal([...left, ...right]);
        node.right = toTerminal([...left, ...right]);
        return;
    }
    if (depth >= maxDepth) {
        node.left = toTerminal(left);
        node.right = toTerminal(right);
        return;
    }
    if (left.length <= minSize) {
        node.left = toTerminal(left);
    } else {
        node.left = getSplit(left);
        split(node.left, maxDepth, minSize, depth + 1);
    }
    if (right.length <= minSize) {
        node.right = toTerminal(right);
    } else {
        node.right = getSplit(right);
        split(node.right, maxDepth, minSize, depth + 1);
    }
}

function buildTree(train, maxDepth, minSize) {
    const root = getSplit(train);
    split(root, maxDepth, minSize, 1);
    return root;
}

function predict(node, row) {
    if (row[node.index] < node.value) {
        if (typeof node.left === 'object' && node.left !== null && !Array.isArray(node.left)) {
            return predict(node.left, row);
        } else {
            return node.left;
        }
    } else {
        if (typeof node.right === 'object' && node.right !== null && !Array.isArray(node.right)) {
            return predict(node.right, row);
        } else {
            return node.right;
        }
    }
}

function decisionTree(train, test, max_depth, min_size) {
    const tree = buildTree(train, max_depth, min_size);
    const predictions = [];
    for (let row of test) {
        const prediction = predict(tree, row);
        predictions.push(prediction);
    }
    return predictions;
}

seed(1);
const filename = 'pages\\tree\\data_banknote_authentication.csv';
let dataset;
try {
    dataset = load_csv(filename);
} catch (error) {
    console.error(`Error loading file ${filename}:`, error);
    console.error("Please ensure the file exists and the script has read permissions.");
    process.exit(1);
}

if (dataset.length > 0 && dataset[0].length > 0) {
    for (let i = 0; i < dataset[0].length; i++) {
        strColumnToFloat(dataset, i);
    }
} else {
    console.error("Dataset is empty or invalid.");
    process.exit(1);
}

const n_folds = 5;
const max_depth = 5;
const min_size = 10;

try {
    const scores = evaluateAlgorithm(dataset, decisionTree, n_folds, max_depth, min_size);
    console.log('Scores: %s', scores);
    const meanAccuracy = scores.reduce((a, b) => a + b, 0) / parseFloat(scores.length);
    console.log('Mean Accuracy: %.3f%%', meanAccuracy);
} catch (error) {
    console.error("Algorithm evaluation failed:", error.message);
}