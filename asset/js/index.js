const ELEMENT = {
    'unlimited': '(.*)', 'all': '全', 'row': '横', 'col': '縦', 'random': '隨機', 'cross': '十字', 'L': 'L字',
    'fire': '火',　'water': '水', 'wood': '木', 'light': '光', 'dark': '闇', 'heart': '回復', 'trash': '邪魔', 
    'poison': '毒', 'mpoison': '猛毒', 'bomb': '爆弾'
};
    
const KAKUSEI = {"火ダメージ軽減":1,"水ダメージ軽減":2,"木ダメージ軽減":3,"光ダメージ軽減":4,"闇ダメージ軽減":5,"HP強化":6,"覚醒アシスト":7,"HP80％以上強化":8,"火ドロップ強化":9,"水ドロップ強化":10,"木ドロップ強化":11,"光ドロップ強化":12,"闇ドロップ強化":13,"攻撃強化":14,"超追加攻撃":15,"HP50％以下強化":16,"火属性強化":17,"水属性強化":18,"木属性強化":19,"光属性強化":20,"闇属性強化":21,"回復強化":22,"スキルチャージ":23,"L字消し軽減":24,"自動回復":25,"バインド耐性":26,"バインド回復":27,"暗闇耐性":28,"お邪魔耐性":29,"毒耐性":30,"バインド耐性+":31,"L字消し攻撃":32,"操作時間延長":33,"スキルブースト":34,"2体攻撃":35,"封印耐性":36,"回復ドロップ強化":37,"マルチブースト":38,"操作時間延長+":39,"超コンボ強化":40,"神キラー":41,"ドラゴンキラー":42,"悪魔キラー":43,"マシンキラー":44,"バランスキラー":45,"攻撃キラー":46,"雲耐性":47,"コンボドロップ":48,"体力キラー":49,"回復キラー":50,"進化用キラー":51,"能力覚醒用キラー":52,"強化合成用キラー":53,"売却用キラー":54,"操作不可耐性":55,"スキルボイス":56,"コンボ強化":57,"ガードブレイク":58,"追加攻撃":59,"チームHP強化":60,"チーム回復強化":61,"ダメージ無効貫通":62,"スキルブースト+":63,"ダンジョンボーナス":64};
const KAKUSEI_N = [null, 
    "火ダメージ軽減", "水ダメージ軽減", "木ダメージ軽減", "光ダメージ軽減", "闇ダメージ軽減", "HP強化", "覚醒アシスト", "HP80％以上強化", 
    "火ドロップ強化", "水ドロップ強化", "木ドロップ強化", "光ドロップ強化", "闇ドロップ強化", "攻撃強化", "超追加攻撃", "HP50％以下強化", 
    "火属性強化", "水属性強化", "木属性強化", "光属性強化", "闇属性強化", "回復強化", "スキルチャージ", "L字消し軽減", 
    "自動回復", "バインド耐性", "バインド回復", "暗闇耐性", "お邪魔耐性", "毒耐性", "バインド耐性+", "L字消し攻撃", 
    "操作時間延長", "スキルブースト", "2体攻撃", "封印耐性", "回復ドロップ強化", "マルチブースト", "操作時間延長+", "超コンボ強化", 
    "神キラー", "ドラゴンキラー", "悪魔キラー", "マシンキラー", "バランスキラー", "攻撃キラー", "雲耐性", "コンボドロップ", 
    "体力キラー", "回復キラー", "進化用キラー", "能力覚醒用キラー", "強化合成用キラー", "売却用キラー", "操作不可耐性", "スキルボイス", 
    "コンボ強化", "ガードブレイク", "追加攻撃", "チームHP強化", "チーム回復強化", "ダメージ無効貫通", "スキルブースト+", "ダンジョンボーナス"
];
let MONSTER;
let SKILLRULE;

let retry = 0;
let timestamp;

window.onload = () => {
    let url1 = 'https://raw.githubusercontent.com/tinolove81/pad-ss/gh-pages/lib/MONSTER-20190327.json';
    let url2 = 'https://raw.githubusercontent.com/tinolove81/pad-ss/gh-pages/lib/SKILLRULE-20190327.json';
    $.ajax({
        'url': url1,
        'dataType': "json",
        'success': function (data) {
            MONSTER = data;
        }
    });
    $.ajax({
        'url': url2,
        'dataType': "json",
        'success': function (data) {
            SKILLRULE = data;
        }
    });

    (function loadDefault () {
        if (retry < 10) {
            if (MONSTER && SKILLRULE) {
                $('.overlay').addClass('d-none');
                lazyload();
            } else {
                retry++;
                setTimeout(loadDefault, 300);
            }
        } else {
            alert('Connect data error.');
        }
    })();
}

$('#nav_btn_Switchtheme').on('click', (e) => {
    let theme = e.currentTarget.dataset.theme;
    if (theme == 'dark') {
        e.currentTarget.dataset.theme = 'light';
        $('body').addClass('theme-light').removeClass('theme-dark');
        $('nav').addClass('navbar-light').removeClass('navbar-dark');
    } else if (theme == 'light') {
        e.currentTarget.dataset.theme = 'dark';
        $('body').addClass('theme-dark').removeClass('theme-light');
        $('nav').addClass('navbar-dark').removeClass('navbar-light');
    }
});

let filterEntry = new FilterEntry('#filterentry');
function FilterEntry(mContainer) {
    this.container = $(mContainer);
    this.hasFilter = false;
    this.AllFilter = {
        'MainAttribute': 'none',
        'SubAttribute': 'none',
        'Type': 'none',
        'Kakusei': []
    };

    this.init = (() => {
        $('#filter_main_attr input', this.container).on('change', (e) => {
            let t = $(e.target);
            let i = t.siblings('i');
            if (e.target.checked) {
                i.removeClass('icon-opacity-5');
                $('#filter_main_attr input', this.container).not(t).prop('checked', false);
                $('#filter_main_attr i', this.container).not(i).addClass('icon-opacity-5');
                this.addFilter('MainAttribute', e.target.value);
            } else {
                i.addClass('icon-opacity-5');
                this.addFilter('MainAttribute', 'none');
            }
        });
        $('#filter_sub_attr input', this.container).on('change', (e) => {
            let t = $(e.target);
            let i = t.siblings('i');
            if (e.target.checked) {
                i.removeClass('icon-opacity-5');
                $('#filter_sub_attr input', this.container).not(t).prop('checked', false);
                $('#filter_sub_attr i', this.container).not(i).addClass('icon-opacity-5');
                this.addFilter('SubAttribute', e.target.value);
            } else {
                i.addClass('icon-opacity-5');
                this.addFilter('SubAttribute', 'none');
            }
        });
        $('#filter_type input', this.container).on('change', (e) => {
            let t = $(e.target);
            let i = t.siblings('i');
            if (e.target.checked) {
                i.removeClass('icon-opacity-5');
                $('#filter_type input', this.container).not(t).prop('checked', false);
                $('#filter_type i', this.container).not(i).addClass('icon-opacity-5');
                this.addFilter('Type', e.target.value);
            } else {
                i.addClass('icon-opacity-5');
                this.addFilter('Type', 'none');
            }
        });
        $('#filter_kakusei input', this.container).on('click', (e) => {
            let frame = $('#filter_kakusei_frame', this.container);
            let selected = $('i', frame);
            if (selected.length < 10) {
                let node_k = $.parseHTML(iconKakuseiTpl(e.target.value));
                $(node_k).attr('data-val', e.target.value).on('click', (e) => {
                    let idx = this.addFilter('Kakusei', e.target.dataset.val, 'remove');
                    if (idx > -1) { $('i', frame).eq(idx + 1).remove(); }
                });
                let n = selected.add(node_k);
                n.sort((a, b) => {
                    return +a['dataset']['val'] - +b['dataset']['val'];
                });
                frame.append(n);
                this.addFilter('Kakusei', e.target.value);
            } else {
                alert('Too much です！');
            }
        });
        $('#filter_btn_submit', this.container).on('click', (e) => {
            this.container.modal('hide');
            resultArea.finalPublish();
        });
        $('#filter_btn_clear', this.container).on('click', (e) => {
            this.resetFilter();
        });
        $('#filter_btn_cancel', this.container).on('click', (e) => {
            this.container.modal('hide');
        });
    })();
    
    this.addFilter = (mType, mData, mAct) => {
        if (mType == 'MainAttribute') {
            this.AllFilter['MainAttribute'] = mData;
        } else if (mType == 'SubAttribute') {
            this.AllFilter['SubAttribute'] = mData;
        } else if (mType == 'Type') {
            this.AllFilter['Type'] = mData;
        } else if (mType == 'Kakusei') {
            if (mAct == 'remove') {
                let i = this.AllFilter['Kakusei'].indexOf(mData);
                if (i > -1) {
                    this.AllFilter['Kakusei'].splice(i, 1);
                    return i;
                } else {
                    return false;
                }
            } else if (mAct == 'clear') {
                this.AllFilter['Kakusei'] = [];
            } else {
                this.AllFilter['Kakusei'].push(mData);
            }
        }
        this.hasFilter = this.AllFilter['MainAttribute'] != 'none' || this.AllFilter['SubAttribute'] != 'none'
                        || this.AllFilter['Type'] != 'none' || this.AllFilter['Kakusei'].length > 0;
    }
    this.resetFilter = () => {
        $('#filter_main_attr input', this.container).prop('checked', false);
        $('#filter_main_attr i', this.container).addClass('icon-opacity-5');
        $('#filter_sub_attr input', this.container).prop('checked', false);
        $('#filter_sub_attr i', this.container).addClass('icon-opacity-5');
        $('#filter_type input', this.container).prop('checked', false);
        $('#filter_type i', this.container).addClass('icon-opacity-5');
        $('#filter_kakusei_frame i:not(:first-child)', this.container).remove();

        this.addFilter('MainAttribute', 'none');
        this.addFilter('SubAttribute', 'none');
        this.addFilter('Type', 'none');
        this.addFilter('Kakusei', 'none', 'clear');
    }
    this.test = (mMon) => {
        let M_mainattr = mMon['MainAttribute'];
        let M_subattr = mMon['SubAttribute'];
        let M_type = [].concat(mMon['Type']);
        let M_kakusei = [].concat(mMon['Kakusei']);
        if (this.hasFilter) {
            if (this.AllFilter['MainAttribute'] != 'none' && this.AllFilter['MainAttribute'] != M_mainattr) {
                return false;
            }
            if (this.AllFilter['SubAttribute'] != 'none' && this.AllFilter['SubAttribute'] != M_subattr) {
                return false;
            }
            if (this.AllFilter['Type'] != 'none' && M_type.indexOf(this.AllFilter['Type']) == -1) {
                return false;
            }
            if (this.AllFilter['Kakusei'].length > 0) {
                let filter = [];
                this.AllFilter['Kakusei'].forEach((e, i) => {
                    if (e == '0') return false;
                    let n = parseInt(e);
                    for (let j = 0; j < n; j++) {
                        filter.push(KAKUSEI_N[i]);
                    }
                })
                for (let i = 0, j = M_kakusei.length; i < j; i++) {
                    for (let m = 0, n = filter.length; m < n; m++) {
                        if (M_kakusei[i] == filter[m]) {
                            M_kakusei[i] = '';
                            filter[m] = '';
                            break;
                        }
                    }
                }
                if (!filter.every((val) => { return val == ''; })) {
                    return false;
                };
            }
            return true;
        } else {
            return true;
        }
    }
}

let ruleEntry = new RuleEntry('#ruleentry', '#rule-library-tpl');
function RuleEntry(mContainer, mTemplate) {
    this.container = $(mContainer);
    this.template = $(mTemplate);

    this.AllRule = {};
    this.nRules = 0;

    this.init = (() => {
        $('#rule_btn_AddRule', this.container).on('click', () => {
            let A = $('#rule_a_change input:checked', this.container).val();
            let B = $('#rule_b_change input:checked', this.container).val();
            if (A && B) {
                this.addRule(A, B);
            } else {
                alert('選項缺失!');
            }
        });
    })();

    this.addRule = (mA, mB) => {
        console.log('addRule start');
        let tpl = this.template.html();
        let iA = iconDropTpl(mA);
        let iB = iconDropTpl(mB);
        this.AllRule[`r${this.nRules}`] = `${ELEMENT[mA]}轉${ELEMENT[mB]}`;
        let node_r = $.parseHTML(tpl
            .replace('{{A}}', iA)
            .replace('{{B}}', iB)
        );
        $('#rule_btn_DelRule', node_r).attr('data-key', `r${this.nRules}`).on('click', (e) => {
            $(e.target).closest('.input-group').fadeOut('fast', () => {
                let key = e.target.dataset.key;
                delete this.AllRule[key];
                $(e.target).closest('.input-group').remove();
                if (this.getRule().length == 0) {
                    $('#ruletips').fadeIn();
                    resultArea.resetResult();
                } else {
                    resultArea.searchMonster();
                }
            });
        });
        $('#ruletips').hide();
        $('#rule_frame', this.container).append(node_r);
        this.nRules++;
        resultArea.searchMonster();
        console.log('addRule finish');
    };
    this.getRule = () => {
        return Object.values(this.AllRule);
    };
}

let sortEntry = new SortEntry('#sortentry');
function SortEntry(mContainer) {
    this.container = $(mContainer);
    this.AllSorter = {
        'SortBy': 'number',
        'SortOrder': 'desc',
        'SortStyle': 'icon'
    };

    this.init = (() => {
        $('#sort_select_by', this.container).on('change', (e) => {
            this.AllSorter['SortBy'] = e.target.value;
        });
        $('#sort_select_order', this.container).on('change', (e) => {
            this.AllSorter['SortOrder'] = e.target.value;
        });
        $('input[name="sort_show"]', this.container).on('change', (e) => {
            this.AllSorter['SortStyle'] = e.target.value;
        });
        $('#sort_btn_submit', this.container).on('click', (e) => {
            this.container.modal('hide');
            resultArea.finalPublish();
        });
        $('#sort_btn_cancel', this.container).on('click', (e) => {
            this.container.modal('hide');
        });
    })();
    this.getSorter = () => {
        return this.AllSorter;
    };
}
let resultArea = new ResultArea('#resultentry', '#result-area-tpl');
function ResultArea(mContainer, mTemplate) {
    let _this = this;
    this.container = $(mContainer);
    this.template = $(mTemplate);

    this.searchresult = [];
    this.$collectresult = $();

    this.init = (() => {
        $('#result_empty', this.container).fadeIn();
        $('#result_loading', this.container).hide();
        $('#result_frame', this.container).hide().html('');
    })();

    // SearchMonster from [SKILLRULE] by {AddRule} export [rule raw data]
    this.searchMonsterTimer;
    this.searchMonster = () => {
        console.log('searchMonster start');
        let rule = ruleEntry.getRule();
        if (rule.length) {
            $('#result_empty', this.container).hide();
            $('#result_loading', this.container).fadeIn();
            $('#result_frame', this.container).hide();
            let mon = [];
            let i = 0, LEN = SKILLRULE.length;
            if (_this.searchMonsterTimer) clearTimeout(_this.searchMonsterTimer);
            _this.searchMonsterTimer = setInterval(
                function goNext() {
                    console.log('searchMonster setInterval');
                    if (Object.keys(ruleEntry.AllRule).length == 0) {
                        clearTimeout(_this.searchMonsterTimer);
                        return console.log('Rule empty');
                    }
                    if (i >= LEN) {
                        clearTimeout(_this.searchMonsterTimer);
                        _this.searchresult = mon;
                        if (_this.searchresult.length > 0) {
                            _this.collectElement();
                        } else {
                            _this.resetResult();
                        }
                        return;
                    }
                    for (i; i < LEN; i++) {
                        let R = true;
                        let M = SKILLRULE[i];
                        for (let j = 0; j < rule.length; j++) {
                            if (R) {
                                R = new RegExp(rule[j]).test(M['SkillRule']);
                            } else {
                                break;
                            }
                        }
                        if (R) mon.push(M);
                    }
                },
                0
            );
        } else {
            this.searchresult = [];
        }
        console.log('searchMonster finish');
    };
    // CollectElement from [searchresult](tag data) by {searchMonster} export [jquery element array with template]
    this.collectElementTimer;
    this.collectElement = () => {
        console.log('collectElement start');
        let exlist = $();
        let i = 0, LEN = this.searchresult.length;
        if (_this.collectElementTimer) clearTimeout(_this.collectElementTimer);
        _this.collectElementTimer = setInterval(
            function goNext() {
                console.log('collectElement setInterval');
                if (Object.keys(ruleEntry.AllRule).length == 0) {
                    clearTimeout(_this.collectElementTimer);
                    return console.log('Rule empty');
                }
                if (i >= LEN) {
                    clearTimeout(_this.collectElementTimer);
                    _this.$collectresult = exlist;
                    _this.finalPublish();
                    return;
                }
                let M = MONSTER[_this.searchresult[i]['Number'] - 1 ];
                let tpl = _this.template.html();
                let node_m = $.parseHTML(tpl.trim()
                    .replace('{{DataNumber}}', M['Number'])
                    .replace('{{DataName}}', M['Name'])
                    .replace('{{DataRare}}', M['Rare'].replace('★', ''))
                    .replace('{{DataSkillCDMin}}', M['ActiveSkillCD'].split('/')[0])
                    .replace('{{DataSkillCDMax}}', M['ActiveSkillCD'].split('/')[1])
                )[0];
                $('.resultcardpic', node_m).addClass(`icon-card icon-card-${('000' + (Math.floor(M['Number'] / 100) + ((M['Number'] % 100 == 0) ? 0 : 1))).substr(-3)}`)
                    .addClass(`ic-${('000' + ((M['Number'] % 100 == 0) ? '100': M['Number'] % 100)).substr(-3)}`)
                    .addClass('icon-attr')
                    .addClass(`ia-${M['MainAttribute'].toLowerCase()} ${((M['SubAttribute'] == 'None') ? '' : 'ia-s-' + M['SubAttribute'].toLowerCase())}`);
                $('.resultcardasset', node_m).addClass(((M['Assist'] == '○') ? 'icon-card-asset' : ''));
                $('.resultcardintro', node_m).html(M['Number']);
                let detail = $('.resultcarddetail > div', node_m);
                detail.eq(0).find(' > div').eq(0).html(`No. ${M['Number']}`);
                detail.eq(0).find(' > div').eq(1).html(M['Name']);
                detail.eq(0).find(' > div').eq(2).html(M['Rare']);
                detail.eq(1).find(' > div').eq(0).html(M['ActiveSkillName']);
                detail.eq(1).find(' > div').eq(1).html(`Lv.1: ${M['ActiveSkillCD'].split('/')[0]}　Lv.最大: ${M['ActiveSkillCD'].split('/')[1]}`);
                detail.eq(2).find(' > div').eq(0).html(M['ActiveSkillContent']);
                detail.eq(3).find(' > div').eq(0).html(iconKakuseiTpl(M['Kakusei']));
                exlist = exlist.add(node_m);
                i++;
            },
            0
        );
        console.log('collectElement finish');
    };
    // FinalPublish from [$collectresult](element array) by {collectElement} around {sort} and {filter} to front side
    this.finalPublishTimer;
    this.finalPublish = () => {
        console.log('finalPublish start');
        $('#result_loading', this.container).hide();
        let area = $('#result_frame', this.container).fadeIn().html('');
        if (this.$collectresult.length) {
            let sorter = sortEntry.getSorter();
            area.removeClass('sort-style-icon sort-style-list').addClass('sort-style-' + sorter['SortStyle']);
            let list = this.$collectresult.sort((a, b) => {
                if (sorter['SortOrder'] == 'asc') {
                    return +a['dataset'][sorter['SortBy']] - +b['dataset'][sorter['SortBy']];
                } else if (sorter['SortOrder'] == 'desc') {
                    return +b['dataset'][sorter['SortBy']] - +a['dataset'][sorter['SortBy']];
                }
            });

            let i = 0, q = 0;
            let LEN = list.length;
            if (_this.finalPublishTimer) clearTimeout(_this.finalPublishTimer);
            _this.finalPublishTimer = setInterval(
                function goNext() {
                    if (Object.keys(ruleEntry.AllRule).length == 0) {
                        clearTimeout(_this.finalPublishTimer);
                        return console.log('Rule empty');
                    }
                    if (i >= LEN) {
                        clearTimeout(_this.finalPublishTimer);
                        return;
                    }
                    let e = list[i];
                    let n = e['dataset']['number'];
                    let M = MONSTER[n - 1];
                    filterEntry.test(M) ? $(e).removeClass('filtered') : $(e).addClass('filtered');
                    $(e).find('.resultcardintro').html(e['dataset'][sorter['SortBy']]);
                    area.append(e);
                    i++;
                    q++;
                    if (q > 10000) clearTimeout(_this.finalPublishTimer);
                },
                0
            );
        }
        console.log('finalPublish finish');
    };
    this.resetResult = () => {
        $('#result_empty', this.container).fadeIn();
        $('#result_loading', this.container).hide();
        $('#result_frame', this.container).hide().html('');
    }
}

function iconDropTpl(n) {
    if (n == 'unlimited'||n == 'all'||n == 'row'||n == 'col'||n == 'random'||n == 'cross'||n == 'L') {
        return `<i class='icon-text-${n}'></i>`;
    } else {
        return `<i class='icon-drop id-${n}'></i>`;
    }
}
function iconKakuseiTpl(mName) {
    if (!isNaN(mName)) {
        return `<i class='icon-kakusei ik-${mName}'></i>`;
    } else if (mName.length) {
        let tpl = [];
        for (let i = 0;i < mName.length; i++) {
            tpl.push(`<i class='icon-kakusei ik-${KAKUSEI[mName[i]]}'></i>`);
        }
        return tpl.join('');
    }
    return `<i class='icon-kakusei ik-0'></i>`;
}

function now(a) {
    if (a == 'u') {
        return Math.round(new Date().getTime() / 1000.0);
    } else if (!isNaN(parseInt(a))) {
        return new Date(parseInt(a) * 1000).toLocaleString(undefined, { hour12: false });
    }
    return '' + new Date().toLocaleString(undefined, { hour12: false });
}