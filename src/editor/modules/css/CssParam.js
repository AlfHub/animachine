'use strict';

var EventEmitter = require('events').EventEmitter;
var inherits = require('inherits');
var uncalc = require('./uncalc');
var Key = require('../../utils/Key');
var OptionLine = require('../../utils/OptionLine');
var KeyLine = require('../../utils/KeyLine');
var amgui = require('../../amgui');

function CssParam (opt) {

    opt = opt || {};

    EventEmitter.call(this);

    this._lineH =  amgui.LINE_HEIGHT;
    this._inputs = [];

    this._onChangeInput = this._onChangeInput.bind(this);
    this._onChangeTime = this._onChangeTime.bind(this);
    this._onChangeKeyLine = this._onChangeKeyLine.bind(this);
    this._onKeyNeedsRemove = this._onKeyNeedsRemove.bind(this);
    this._onClickTgglKey = this._onClickTgglKey.bind(this);
    this._onClickStepPrevKey = this._onClickStepPrevKey.bind(this);
    this._onClickStepNextKey = this._onClickStepNextKey.bind(this);

    this._createKeyline(opt.keyLine);
    this._createOptions(opt.optionLine);

    this.deOptionLine = this.optionLine.domElem;
    this.deKeyLine = this.keyLine.domElem;

    am.timeline.on('changeTime', this._onChangeTime);

    if (opt) {
        this.useSave(opt);
    }
}

inherits(CssParam, EventEmitter);
var p = CssParam.prototype;
module.exports = CssParam;









Object.defineProperties(p, {

    height: {
        get: function () {
            
            return this._lineH;
        }
    },
    name: {
        set: function (v) {

            if (v === this._name) return;

            this._name = v;
            this.optionLine.title = v;
        },
        get: function () {
            return this._name
        }
    }
});





p.getSave = function () {

    var save = {
        name: this.name,
        keys: [],
    };

    this.keyLine.forEachKeys(function (key) {

        save.keys.push(key.getSave());
    });

    return save;
};

p.useSave = function(save) {

    this.name = save.name;

    if (save.keys) {

        save.keys.forEach(this.addKey, this);
    }
};

p.getScriptKeys = function () {

    var keys = [];

    this.keyLine.forEachKeys(function (key) {

        var k = {
            offset: key.time / am.timeline.length,
        };

        k[this.name] = this.getValue(key.time);
        
        if (key.ease && key.ease !== 'linear') {

           k.easing = key.ease; 
        }

        keys.push(k);
    }, this);

    keys.sort(function (a, b) {

        return a.offset - b.offset;
    });

    return keys;
};

p.getValue = function (time) {

    if (!_.isNumber(time)) {
        time = am.timeline.currTime;
    }

    var before, after, same;

    this.keyLine.forEachKeys(function (key) {

        if (key.time === time) {
        
            same = key;
        }

        if (key.time < time && (!before || before.time < key.time)) {
        
            before = key;
        }

        if (key.time > time && (!after || after.time > key.time)) {
        
            after = key;
        }
    });

    if (same) {

        return same.value;
    }
    else {

        if (after && before) {

            var p = (time - before.time) / (after.time - before.time), 
                av = uncalc(after.value), bv = uncalc(before.value);

            p = this._applyEase(before.ease, p);

            return createCalc(av, bv, p);
        }
        else if (before) {
            
            return before.value;
        }
        else if (after) {
            
            return after.value;
        }
    }

    function createCalc(av, bv, p) {

        if (!isNaN(av) && !isNaN(bv)) {

            return parseFloat(bv) + ((av - bv) * p);
        }

        var aUnit = getUnit(av);
        var bUnit = getUnit(bv);
        
        if (aUnit === bUnit) {

            av = parseFloat(av);
            bv = parseFloat(bv);
            
            return (bv + ((av - bv) * p)) + aUnit;
        };

        var avs = _.compact(av.split(' ')),
            bvs = _.compact(bv.split(' ')),
            avl = avs.length,
            bvl = bvs.length,
            ret = [];

        if (avl !== bvl) {

            if (avl < bvl) {

                avs = avs.concat(bvs.slice(avl));
            }
            else {
                bvs = bvs.concat(avs.slice(bvl));
            }         
        }

        avs.forEach(function (a, idx) {

            ret.push(calc(a, bvs[idx]));
        });

        return ret.join(' ');

        function calc(a, b) {

            return 'calc(' + b + ' + (' + a + ' - ' + b + ')*' + p + ')';
        }

        function getUnit(v) {

            var m = /([a-z]+)$/.exec(v);

            return m && m[1];
        }
    }
};

p.addKey = function (opt, skipHistory) {
    
    var key = this.getKey(opt.time);

    if (key) {

        if ('value' in opt) {

            if (!skipHistory) {
                am.history.saveChain(key, [this.addKey, this, key, true], [this.addKey, this, opt, true], 'edit key');
            }

            key.value = opt.value;
        }
    }
    else {

        key = new Key(opt);
        key.value = 'value' in opt ? opt.value : this.getValue(opt.time);

        this.keyLine.addKey(key);

        if (!skipHistory) {
            am.history.closeChain(key);
            am.history.save([this.removeKey, this, opt.time, true], [this.addKey, this, opt, true], 'add key');
        }
        
        this.emit('addKey');
    }

    this._refreshInputs();
    this._refreshTgglKey();

    this.emit('change');

    return key;
};

p.removeKey = function (key, skipHistory) {

    if (!this.keyLine.removeKey(key)) {

        return;
    }

    if (!skipHistory) {
        am.history.save([this.addKey, this, key, true],
            [this.removeKey, this, key, true], 'remove key');
    }

    this._refreshTgglKey();

    this.emit('change');
};

p.getKey = function (time) {

    return this.keyLine.getKeyByTime(time);
};

p.getPrevKey = function (time) {

    return this.keyLine.getPrevKey(time);
};

p.getNextKey = function (time) {

    return this.keyLine.getNextKey(time);
};

p.gotoPrevKey = function (time) {

    var key = this.getPrevKey(am.timeline.currTime);

    if (key) {
        am.timeline.currTime = key.time;
    }
};

p.gotoNextKey = function (time) {

    var key = this.getNextKey(am.timeline.currTime);

    if (key) {
        am.timeline.currTime = key.time;
    }
};

p.getKeyTimes = function () {

    return this.keyLine.getKeyTimes();
};

p.toggleKey = function () {

    var key = this.getKey(am.timeline.currTime);

    if (key) {
        this.removeKey(key);
    }
    else {
        this.addKey({time: am.timeline.currTime});
    }
};

p.isValid = function () {

    return this.keyLine.keyCount !== 0;
};

p.attachInput = function (input) {

    this.detachInput(input);

    input.on('change', this._onChangeInput);
  
    this._inputs.push(input);
};

p.detachInput = function (input) {

    var idx = this._inputs.indexOf(input);

    if (idx === -1) {
        return;
    }

    input.removeListener('change', this._onChangeInput);
  
    this._inputs.splice(idx, 1);
};









p._applyEase = function (ease, value) {

    var rx = /cubic-bezier\(\s*([\d\.]+)\s*,\s*([\d\.-]+)\s*,\s*([\d\.]+)\s*,\s*([\d\.-]+)\s*\)/,
        m = rx.exec(ease);

    if (!m) {
        return value;
    }
    
    var p = [0, 0, parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]), parseFloat(m[4]), 1, 1];

    count(0);
    count(2);
    count(4);
    count(0);
    count(2);
    count(0);

    return p[1];


    function count(i) {

        p[i+0] = p[i+0] + (p[i+2] - p[i+0]) * value;
        p[i+1] = p[i+1] + (p[i+3] - p[i+1]) * value;
    }
};








p._onChangeInput = function (value) {

    if (String(value) === String(this.getValue())) {
        return;
    }
 console.log('nm', value, this.getValue())
    this.addKey({
        time: am.timeline.currTime,
        value: value
    });

    this.emit('change');
};

p._onChangeKeyLine = function () {

    this.emit('change');
};

p._onKeyNeedsRemove = function (key) {

    this.removeKey(key);
};

p._onChangeTime = function () {

    this._refreshInputs();
    this._refreshTgglKey();
};

p._onClickTgglKey = function () {

    this.toggleKey();
};

p._onClickStepPrevKey = function () {

    this.gotoPrevKey();
};

p._onClickStepNextKey = function () {

    this.gotoNextKey();
};









p._refreshInputs = function () {

    var value = this.getValue();

    this._inputs.forEach(function (input) {

        input.value = value;
    });
};

p._refreshTgglKey = function () {

    var time = am.timeline.currTime,
        key = this.getKey(time);
    
    this.optionLine.buttons.key.setHighlight(!!key);
    this.optionLine.buttons.key.setSteppers(!!this.getPrevKey(time), !!this.getNextKey(time));
};






p._createOptions = function (opt) {

    this.optionLine = new OptionLine(_.merge({
        contextMenuOptions: [
            {text: 'move up', onSelect: this.emit.bind(this, 'move', this, -1)},
            {text: 'move down', onSelect: this.emit.bind(this, 'move', this, 1)},
            {text: 'delete', onSelect: this.emit.bind(this, 'delete', this)}
        ],
        title: {
            text: this.name
        },
        btnKey: {
            onClick: this._onClickTgglKey,
            onClickPrev: this._onClickStepPrevKey,
            onClickNext: this._onClickStepNextKey,
        },
        inputs: [{
            type: 'unit',
            onChange: this._onChangeInput,
            units: [],
            name: 'input'
        }],
        indent: 0
    }, opt));

    this.attachInput(this.optionLine.inputs.input);
};

p._createKeyline = function () {

    this.keyLine = new KeyLine();
    this.keyLine.on('change', this._onChangeKeyLine);
    this.keyLine.on('keyNeedsRemove', this._onKeyNeedsRemove);
};






p.dispose = function () {

    //TODO
};