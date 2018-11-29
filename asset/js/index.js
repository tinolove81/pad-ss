let retry = 0;
let monster;
let skilltag;
let element = {
    'none': '(.*)', 'all': '全', 'row': '横', 'col': '縦', 'random': '隨機', 'fire': '火',
    'water': '水', 'wood': '木', 'light': '光', 'dark': '闇', 'heart': '回復', 'trash': '邪魔', 
    'poison': '毒', 'mpoison': '猛毒', 'bomb': '爆弾' };
    
let kakusei = [
    "HP強化", "攻撃強化", "回復強化", "火ダメージ軽減", "水ダメージ軽減", "木ダメージ軽減", "光ダメージ軽減", "闇ダメージ軽減",
    "自動回復", "バインド耐性", "暗闇耐性", "お邪魔耐性", "毒耐性", "火ドロップ強化", "水ドロップ強化", "木ドロップ強化", "光ドロップ強化",
    "闇ドロップ強化", "操作時間延長", "バインド回復", "スキルブースト", "火属性強化", "水属性強化", "木属性強化", "光属性強化", "闇属性強化",
    "2体攻撃", "封印耐性", "回復ドロップ強化", "マルチブースト", "神キラー", "マシンキラー", "悪魔キラー", "ドラゴンキラー", "回復キラー",
    "攻撃キラー", "体力キラー", "バランスキラー", "能力覚醒用キラー", "売却用キラー", "強化合成用キラー", "進化用キラー", "コンボ強化",
    "ガードブレイク", "追加攻撃", "チームHP強化", "チーム回復強化", "ダメージ無効貫通", "覚醒アシスト", "超追加攻撃", "スキルチャージ",
    "バインド耐性+", "操作時間延長+", "雲耐性", "操作不可耐性", "スキルブースト+", "HP80％以上強化", "HP50％以下強化", "L字消し軽減",
    "L字消し攻撃", "超コンボ強化", "コンボドロップ", "スキルボイス", "ダンジョンボーナス"
];

let SearchMonster = [];

let filterEntry = new FilterEntry('#filterentry');
let ruleLibrary = new RuleLibrary('#rulelibrary', '#rule-library-tpl');
let resultArea = new ResultArea('#resultarea', '#result-area-min-tpl', '#result-area-detail-tpl', '#resultconfig');

$.getJSON('./lib/CHAR_modify.json', (data) => {
    monster = data;
});
$.getJSON('./lib/TAG.json', (data) => {
    skilltag = data;
});

(function loadDefault() {
    if (retry < 10) {
        if (monster != undefined && skilltag != undefined) {
            $('.overlay').addClass('d-none');
        } else {
            setTimeout(loadDefault, 300);
        }
        retry++;
    } else {
        alert('Connect database error.');
    }
})();

function FilterEntry(mCotainer) {
    this.cotainer = $(mCotainer);

    this.hasFilter = false;
    this.hasFilter_kakusei = false;
    this.AllFilter = {
        'MainAttribute': 'none',
        'SubAttribute': 'none',
        'Type': 'none',
        'Kakusei': []
    };

    this.init = (() => {
        $('#filter_mainattr input', this.cotainer).on('change', (e) => {
            this.addFilter('MainAttribute', e.target.value);
        });
        $('#filter_subattr input', this.cotainer).on('change', (e) => {
            this.addFilter('SubAttribute', e.target.value);
        });
        $('#filter_type input', this.cotainer).on('change', (e) => {
            this.addFilter('Type', e.target.value);
        });
        $('#filter_kakusei select', this.cotainer).on('change', (e) => {
            this.addFilter('Kakusei');
        });
    })();
    
    this.addFilter = (mType, mData) => {
        if (mType == 'MainAttribute') {
            this.AllFilter['MainAttribute'] = mData;
        } else if (mType == 'SubAttribute') {
            this.AllFilter['SubAttribute'] = mData;
        } else if (mType == 'Type') {
            this.AllFilter['Type'] = mData;
        } else if (mType == 'Kakusei') {
            this.AllFilter['Kakusei'] = [];
            $('#filter_kakusei select', this.cotainer).each((i, e) => {
                this.AllFilter['Kakusei'].push(e.value);
            });
        }
        this.hasFilter_kakusei = !this.AllFilter['Kakusei'].every((val) => {
            return val == '0';
        });
        this.hasFilter = this.AllFilter['MainAttribute'] != 'none' || this.AllFilter['SubAttribute'] != 'none'
            || this.AllFilter['Type'] != 'none' || this.hasFilter_kakusei;
    }
    this.test = (monster) => {
        let step = 0;
        if (this.hasFilter) {
            if (this.AllFilter['MainAttribute'] != 'none') {
                ;
            } else { step += 1; }
            if (this.AllFilter['SubAttribute'] != 'none') {
                ;
            } else { step += 1; }
            if (this.AllFilter['Type'] != 'none') {
                ;
            } else { step += 1; }
            if (this.hasFilter_kakusei) {
                monster['Kakusei'].map((e) => {
                for (let i = 0; i < this.AllFilter['Kakusei'].length; i++) {
                    let kname = kakusei[this.AllFilter['Kakusei'][i]];
                    if (kname == e) {
                        this.AllFilter['Kakusei'].splice(i, 1);
                    }
                }
            });
            return filter.length == 0;
            } else { step += 1; }
            return step == 4;
        } else {
            return true;
        }

        
    }
}

function RuleLibrary(mCotainer, mTemplate) {
    this.cotainer = $(mCotainer);
    this.template = $(mTemplate);

    this.AllRule = {};

    this.init = (() => {
        $('#btnAddRule').on('click', (e) => {
            let A = $('input[name="Change_A"]:checked').val();
            let B = $('input[name="Change_B"]:checked').val();
            if (A && B) {
                this.addRule(`${A}-${B}`);
            } else {
                alert('選項缺失!');
            }
        });
    })();

    this.addRule = (mData) => {
        let tpl = this.template.html();
        let nRules = this.getTag().length;
        let A = mData.split('-')[0];
        let B = mData.split('-')[1];
        this.AllRule['k' + nRules] = `${element[A]}轉${element[B]}`;
        this.cotainer.append(tpl
            .replace(/{{nRules}}/g, 'k' + nRules)
            .replace('{{nRules+1}}', nRules + 1)
            .replace('{{A}}', iconDropTpl(A))
            .replace('{{B}}', iconDropTpl(B))
            ).children(':last').hide().fadeIn();
            
        $(`#btnDelRule${'k' + nRules}`).on('click', (e) => {
            $(e.target).closest('.input-group').fadeOut('fast', () => {
                let key = e.target.id.slice(10);
                delete this.AllRule[key];
                $(e.target).closest('.input-group').remove();
                if (this.getTag().length == 0) {
                    $('#ruletips').fadeIn();
                    $('#resultarea').html('');
                } else {
                    resultArea.search();
                }
            });
        });
        $('#ruletips').hide();
        resultArea.search();
    };
    this.getTag = () => {
        return Object.values(this.AllRule);
    };
}

function ResultArea(mCotainer, mMinTemplate, mDetailTemplate, mControl) {
    this.cotainer = $(mCotainer);
    this.mtpl = $(mMinTemplate);
    this.dtpl = $(mDetailTemplate);
    this.control = $(mControl);

    this.sort = 'number';
    this.sortorder = 'asc';
    this.style = 'icon';
    this.searchresult = [];
    this.$exportresult;

    this.init = (() => {
        this.control.find('#resultconfig_sort').on('change', (e) => {
            this.sort = $(e.target).val();
            this.sorter();
        });
        this.control.find('#resultconfig_sortorder').on('change', (e) => {
            this.sortorder = $(e.target).val();
            this.sorter();
        });
        this.control.find('input[name="resultconfig_style"]').on('change', (e) => {
            this.style = $(e.target).val();
            this.export();
        });
    })();

    this.search = () => {
        let tag = ruleLibrary.getTag();
        if (tag.length) {
            let mon = [];
            let tmp = [];
            for (let i = 0; i < tag.length; i++) {
                if (i == 0) {
                    for (let j = 0; j < skilltag.length; j++) {
                        let item = skilltag[j];
                        if (new RegExp(tag[i]).test(item['tag'])) {
                            mon.push(item);
                        }
                    }
                } else {
                    for (let j = 0; j < mon.length; j++) {
                        let item = mon[j];
                        if (new RegExp(tag[i]).test(item['tag'])) {
                            tmp.push(item);
                        }
                    }
                    mon = tmp;
                    tmp = [];
                }
            }
            this.searchresult = mon;
            this.export();
        }
    };
    this.export = () => {
            let exlist = $();
            if (this.style == 'icon') {
                this.searchresult.forEach((e, i) => {
                    let mtpl = $(this.mtpl.contents()[1]).clone();
                    let M = monster[e['no'] - 1 ];
                    mtpl.attr('data-number', e['no'])
                        .attr('data-name', M['Name'])
                        .attr('data-rare', M['Rare'].replace('★', ''))
                        .attr('data-skillcdmin', M['ActiveSkillCD'].replace('）', '').split('（')[0])
                        .attr('data-skillcdmax', M['ActiveSkillCD'].replace('）', '').split('（')[1]);
                    exlist = exlist.add(mtpl);
                });
            } else if (this.style == 'list') {
                this.searchresult.forEach((e, i) => {
                    let dtpl = $(this.dtpl.contents()[1]).clone();
                    let M = monster[e['no'] - 1 ];
                    dtpl.attr('data-number', e['no'])
                        .attr('data-rare', M['Rare'].replace('★', ''))
                        .attr('data-skillcdmin', M['ActiveSkillCD'].replace('）', '').split('（')[0])
                        .attr('data-skillcdmax', M['ActiveSkillCD'].replace('）', '').split('（')[1])
                    dtpl.find('.card-text > div').eq(0).find(' > div').eq(0).html(`No. ${e['no']}`);
                    dtpl.find('.card-text > div').eq(0).find(' > div').eq(1).html(M['Name']);
                    dtpl.find('.card-text > div').eq(0).find(' > div').eq(2).html(M['Rare']);
                    dtpl.find('.card-text > div').eq(1).find(' > div').eq(0).html(M['ActiveSkillName']);
                    dtpl.find('.card-text > div').eq(1).find(' > div').eq(1).html(M['ActiveSkillCD']);
                    dtpl.find('.card-text > div').eq(2).find(' > div').eq(0).html(M['ActiveSkillContent']);
                    dtpl.find('.card-text > div').eq(3).find(' > div').eq(0).html(iconKakuseiTpl(M['Kakusei']));
                    exlist = exlist.add(dtpl);
                });
            }
            this.$exportresult = exlist;
            this.sorter();
    };
    this.sorter = () => {
        this.cotainer.html('');
        if (this.$exportresult.length) {
            let fn = this.sort;
            let order = this.sortorder;
            let list = this.$exportresult.sort((a, b) => {
                if (order == 'asc') {
                    return +a['dataset'][fn] - +b['dataset'][fn];
                } else if (order == 'desc') {
                    return +b['dataset'][fn] - +a['dataset'][fn];
                }
            });
            if (this.style == 'icon') {
                this.cotainer.removeClass('flex-column');
                $.each(list, (i, e) => {
                    $(e).find('.sortdata').html(e['dataset'][fn]);
                    this.cotainer.append(e).children(':last').hide().fadeIn();
                });
            } else if (this.style == 'list') {
                this.cotainer.addClass('flex-column');
                $.each(list, (i, e) => {
                    this.cotainer.append(e).children(':last').hide().fadeIn();
                });
            }
        }
    };
}

function iconDropTpl(n) {
    if (n == 'none'||n == 'all'||n == 'row'||n == 'col'||n == 'random') {
        return `<i class='icon-${n}'></i>`;
    } else {
        return `<i class='icon-drop id-${n}'></i>`;
    }
}
function iconKakuseiTpl(n) {
    if (n.length) {
        let tpl = [];
        for (let i = 0;i < n.length; i++) {
            tpl.push(`<i class='icon-kakusei i-kakusei-${kakusei[n[i]]}'></i>`);
        }
        return tpl.join('');
    }
    return `<i class='icon-kakusei i-kakusei-none'></i>`;
}

function now(a) {
    if (a == 'u') {
        return Math.round(new Date().getTime() / 1000.0);
    } else if (!isNaN(parseInt(a))) {
        return new Date(parseInt(a) * 1000).toLocaleString(undefined, { hour12: false });
    }
    return '' + new Date().toLocaleString(undefined, { hour12: false });
}