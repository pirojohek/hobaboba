function strColumnToFloat(dataset, column) {
    for (let row of dataset) {
        row[column] = parseFloat(row[column].trim());
    }
}

function testSplit(index, value, dataset) {
    const left = dataset.filter(row => row[index] < value);
    const right = dataset.filter(row => row[index] >= value);
    return [left, right];
}

function giniIndex(groups, classes) {
    const total = groups.reduce((sum, group) => sum + group.length, 0);
    let gini = 0;
    
    for (const group of groups) {
        if (group.length === 0) continue;
        
        let score = 0;
        for (const classVal of classes) {
            const p = group.filter(row => row[row.length - 1] === classVal).length / group.length;
            score += p * p;
        }
        gini += (1 - score) * (group.length / total);
    }
    return gini;
}

function getSplit(dataset) {
    const classValues = [...new Set(dataset.map(row => row[row.length - 1]))];
    let bestSplit = { index: 0, value: 0, groups: null, score: Infinity };
    
    for (let index = 0; index < dataset[0].length - 1; index++) {
        for (const row of dataset) {
            const groups = testSplit(index, row[index], dataset);
            const gini = giniIndex(groups, classValues);
            
            if (gini < bestSplit.score) {
                bestSplit = { index, value: row[index], groups, score: gini };
            }
        }
    }
    return bestSplit;
}

function toTerminal(group) {
    const outcomes = group.map(row => row[row.length - 1]);
    return outcomes.sort((a, b) =>
        outcomes.filter(v => v === a).length - outcomes.filter(v => v === b).length
    ).pop();
}

function splitNode(node, maxDepth, minSize, depth) {
    const [left, right] = node.groups;
    delete node.groups;
    
    if (!left.length || !right.length) {
        node.left = node.right = toTerminal(left.concat(right));
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
        splitNode(node.left, maxDepth, minSize, depth + 1);
    }
    
    if (right.length <= minSize) {
        node.right = toTerminal(right);
    } else {
        node.right = getSplit(right);
        splitNode(node.right, maxDepth, minSize, depth + 1);
    }
}

function buildTree(train, maxDepth, minSize) {
    const root = getSplit(train);
    splitNode(root, maxDepth, minSize, 1);
    return root;
}

function predictSingle(node, row, way) {
    if (row[node.index] < node.value) {
        if (typeof node.left === 'object') {
            way.push(["left", 1]);
            return predictSingle(node.left, row, way);
        }else{
            way.push(["left", 1]);
        }
        return node.left;
    } else {
        if (typeof node.right === 'object') {
            way.push(["right", 0]);
            return predictSingle(node.right, row, way);
        }else{
            way.push(["right", 0]);
        }
        return node.right;
    }
}

function predictAll(tree, testData) {
    return testData.map(row => predictSingle(tree, row));
}