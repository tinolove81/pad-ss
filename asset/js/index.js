const ELEMENT = {
    'none': '(.*)', 'all': '全', 'row': '横', 'col': '縦', 'random': '隨機', 'fire': '火',
    'water': '水', 'wood': '木', 'light': '光', 'dark': '闇', 'heart': '回復', 'trash': '邪魔', 
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

let retry = 0;
let timestamp;

let filterEntry = new FilterEntry('#filterentry');
let ruleLibrary = new RuleLibrary('#rulelibrary', '#rule-library-tpl');
let resultArea = new ResultArea('#resultarea', '#result-area-tpl', '#resultconfig');

window.onload = () => {
    (function loadDefault () {
        if (retry < 10) {
            if (MONSTER && SKILLTAG) {
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

$('#btnswitchtheme').on('click', (e) => {
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
            this.AllFilter['Kakusei'] = [0];
            $('#filter_kakusei select', this.cotainer).each((i, e) => {
                this.AllFilter['Kakusei'].push(e.value);
            });
        }
        this.hasFilter_kakusei = !this.AllFilter['Kakusei'].every((val) => {
            return val == '0';
        });
        this.hasFilter = this.AllFilter['MainAttribute'] != 'none' || this.AllFilter['SubAttribute'] != 'none'
            || this.AllFilter['Type'] != 'none' || this.hasFilter_kakusei;

        resultArea.finalPublish();
    }
    this.test = (mMon) => {
        let M_mainattr = mMon['MainAttribute'];
        let M_subattr = mMon['SubAttribute'];
        let M_type = [].concat(mMon['type']);
        let M_kakusei = [].concat(mMon['Kakusei']);
        if (this.hasFilter) {
            if (this.AllFilter['MainAttribute'] != 'none' && this.AllFilter['MainAttribute'] != M_mainattr) {
                return false;
            }
            if (this.AllFilter['SubAttribute'] != 'none' && this.AllFilter['SubAttribute'] != M_subattr) {
                return false;
            }
            if (this.AllFilter['Type'] != 'none') {
                if (M_type.indexOf(this.AllFilter['Type']) == -1) {
                    return false;
                }
            }
            if (this.hasFilter_kakusei) {
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

function RuleLibrary(mCotainer, mTemplate) {
    this.cotainer = $(mCotainer);
    this.template = $(mTemplate);

    this.AllRule = {};
    this.nRules = 0;

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
        let A = mData.split('-')[0];
        let B = mData.split('-')[1];
        this.AllRule['k' + this.nRules] = `${ELEMENT[A]}轉${ELEMENT[B]}`;
        this.cotainer.append(tpl
            .replace(/{{nRules}}/g, 'k' + this.nRules)
            .replace('{{A}}', iconDropTpl(A))
            .replace('{{B}}', iconDropTpl(B))
            );
            
        $(`#btnDelRule${'k' + this.nRules}`).on('click', (e) => {
            $(e.target).closest('.input-group').fadeOut('fast', () => {
                let key = e.target.id.slice(10);
                delete this.AllRule[key];
                $(e.target).closest('.input-group').remove();
                if (this.getTag().length == 0) {
                    $('#ruletips').fadeIn();
                    $('#resultarea').html('');
                } else {
                    resultArea.searchMonster();
                }
            });
        });
        $('#ruletips').hide();
        this.nRules++;
        resultArea.searchMonster();
    };
    this.getTag = () => {
        return Object.values(this.AllRule);
    };
}

function ResultArea(mCotainer, mTemplate, mControl) {
    let _this = this;
    this.cotainer = $(mCotainer);
    this.tmpl = $(mTemplate);
    this.control = $(mControl);

    this.sort = 'number';
    this.sortorder = 'asc';
    this.style = 'icon';
    this.searchresult = [];
    this.$collectresult = $();

    this.init = (() => {
        this.control.find('#resultconfig_sort').on('change', (e) => {
            this.sort = $(e.target).val();
            this.finalPublish();
        });
        this.control.find('#resultconfig_sortorder').on('change', (e) => {
            this.sortorder = $(e.target).val();
            this.finalPublish();
        });
        this.control.find('input[name="resultconfig_style"]').on('change', (e) => {
            this.style = $(e.target).val();
            this.cotainer.removeClass('style-list').removeClass('style-icon');
            this.cotainer.addClass('style-' + this.style);
        });
    })();

    // SearchMonster from [SkillTag] by {AddRule} export [tag raw data]
    this.searchMonster = () => {
        let tag = ruleLibrary.getTag();
        if (tag.length) {
            let mon = [];
            let tmp = [];
            for (let i = 0; i < tag.length; i++) {
                if (i == 0) {
                    for (let j = 0; j < SKILLTAG.length; j++) {
                        let item = SKILLTAG[j];
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
            this.collectElement();
        } else {
            this.searchresult = [];
        }
    };
    // CollectElement from [searchresult](tag data) by {searchMonster} export [jquery element array with template]
    this.collectElement = () => {
            let exlist = $();
            this.searchresult.forEach((e, i) => {
                let tmpl = $(this.tmpl.contents()[1]).clone();
                let M = MONSTER[e['no'] - 1 ];
                tmpl.attr('data-number', e['no'])
                tmpl.attr('data-name', M['Name'])
                    .attr('data-mainattr', M['MainAttribute'])
                    .attr('data-subattr', M['SubAttribute'])
                    .attr('data-rare', M['Rare'].replace('★', ''))
                    .attr('data-skillcdmin', M['ActiveSkillCD'].replace('）', '').split('（')[0])
                    .attr('data-skillcdmax', M['ActiveSkillCD'].replace('）', '').split('（')[1]);
                tmpl.find('.resultcardpic').eq(0).addClass(`icon-card icon-card-${('000' + (Math.floor(e['no'] / 100) + ((e['no'] % 100 == 0) ? 0 : 1))).substr(-3)}`);
                tmpl.find('.resultcardpic').eq(0).addClass(`ic-${('000' + ((e['no'] % 100 == 0) ? '100': e['no'] % 100)).substr(-3)}`);
                tmpl.find('.resultcardpic').eq(0).addClass('icon-attr');
                tmpl.find('.resultcardpic').eq(0).addClass(`ia-${M['MainAttribute'].toLowerCase()} ${((M['SubAttribute'] == 'None') ? '' : 'ia-s-' + M['SubAttribute'].toLowerCase())}`);
                tmpl.find('.resultcardintro').eq(0).html(e['no']);
                let detail = tmpl.find('.resultcarddetail > div');
                detail.eq(0).find(' > div').eq(0).html(`No. ${e['no']}`);
                detail.eq(0).find(' > div').eq(1).html(M['Name']);
                detail.eq(0).find(' > div').eq(2).html(M['Rare']);
                detail.eq(1).find(' > div').eq(0).html(M['ActiveSkillName']);
                detail.eq(1).find(' > div').eq(1).html(M['ActiveSkillCD']);
                detail.eq(2).find(' > div').eq(0).html(M['ActiveSkillContent']);
                detail.eq(3).find(' > div').eq(0).html(iconKakuseiTpl(M['Kakusei']));
                exlist = exlist.add(tmpl);
            });
            this.$collectresult = exlist;
            this.finalPublish();
    };
    // FinalPublish from [$collectresult](element array) by {collectElement} around {sort} and {filter} to front side
    this.finalPublish = () => {
        this.cotainer.html('');
        if (this.$collectresult.length) {
            let fn = this.sort;
            let order = this.sortorder;
            let list = this.$collectresult.sort((a, b) => {
                if (order == 'asc') {
                    return +a['dataset'][fn] - +b['dataset'][fn];
                } else if (order == 'desc') {
                    return +b['dataset'][fn] - +a['dataset'][fn];
                }
            });

            let i = 0;
            let timer = setInterval(
                function goNext() {
                    console.log('sett', i);
                    if (i >= list.length) {
                        clearTimeout(timer);
                        return;
                    }
                    for (i; i < list.length; i++) {
                        let e = list[i];
                        let n = e['dataset']['number'];
                        let M = MONSTER[n - 1];
                        filterEntry.test(M) ? $(e).removeClass('filtered') : $(e).addClass('filtered');
                        $(e).find('.resultcardintro').html(e['dataset'][fn]);
                        _this.cotainer.append(e);
                    }
                },
                0
            );


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
            tpl.push(`<i class='icon-kakusei ik-${KAKUSEI[n[i]]}'></i>`);
        }
        return tpl.join('');
    }
    return `<i class='icon-kakusei ik-none'></i>`;
}

function now(a) {
    if (a == 'u') {
        return Math.round(new Date().getTime() / 1000.0);
    } else if (!isNaN(parseInt(a))) {
        return new Date(parseInt(a) * 1000).toLocaleString(undefined, { hour12: false });
    }
    return '' + new Date().toLocaleString(undefined, { hour12: false });
}