const ELEMENT = {
    'none': '(.*)', 'all': '全', 'row': '横', 'col': '縦', 'random': '隨機', 'fire': '火',
    'water': '水', 'wood': '木', 'light': '光', 'dark': '闇', 'heart': '回復', 'trash': '邪魔', 
    'poison': '毒', 'mpoison': '猛毒', 'bomb': '爆弾'
};
    
const KAKUSEI = {
    "HP強化": 1, "攻撃強化": 2, "回復強化": 3, "火ダメージ軽減": 4, "水ダメージ軽減": 5, "木ダメージ軽減": 6, "光ダメージ軽減": 7,
    "闇ダメージ軽減": 8, "自動回復": 9, "バインド耐性": 10, "暗闇耐性": 11, "お邪魔耐性": 12, "毒耐性": 13, "火ドロップ強化": 14,
    "水ドロップ強化": 15, "木ドロップ強化": 16, "光ドロップ強化": 17, "闇ドロップ強化": 18, "操作時間延長": 19, "バインド回復": 20,
    "スキルブースト": 21, "火属性強化": 22, "水属性強化": 23, "木属性強化": 24, "光属性強化": 25, "闇属性強化": 26, "2体攻撃": 27,
    "封印耐性": 28, "回復ドロップ強化": 29, "マルチブースト": 30, "神キラー": 31, "マシンキラー": 32, "悪魔キラー": 33, "ドラゴンキラー": 34,
    "回復キラー": 35, "攻撃キラー": 36, "体力キラー": 37, "バランスキラー": 38, "能力覚醒用キラー": 39, "売却用キラー": 40, "強化合成用キラー": 41,
    "進化用キラー": 42, "コンボ強化": 43, "ガードブレイク": 44, "追加攻撃": 45, "チームHP強化": 46, "チーム回復強化": 47, "ダメージ無効貫通": 48,
    "覚醒アシスト": 49, "超追加攻撃": 50, "スキルチャージ": 51, "バインド耐性+": 52, "操作時間延長+": 53, "雲耐性": 54, "操作不可耐性": 55,
    "スキルブースト+": 56, "HP80％以上強化": 57, "HP50％以下強化": 58, "L字消し軽減": 59, "L字消し攻撃": 60, "超コンボ強化": 61,
    "コンボドロップ": 62, "スキルボイス": 63, "ダンジョンボーナス": 64
};
const KAKUSEI_N = [
    "HP強化", "攻撃強化", "回復強化", "火ダメージ軽減", "水ダメージ軽減", "木ダメージ軽減", "光ダメージ軽減", "闇ダメージ軽減",
    "自動回復", "バインド耐性", "暗闇耐性", "お邪魔耐性", "毒耐性", "火ドロップ強化", "水ドロップ強化", "木ドロップ強化", "光ドロップ強化",
    "闇ドロップ強化", "操作時間延長", "バインド回復", "スキルブースト", "火属性強化", "水属性強化", "木属性強化", "光属性強化", "闇属性強化",
    "2体攻撃", "封印耐性", "回復ドロップ強化", "マルチブースト", "神キラー", "マシンキラー", "悪魔キラー", "ドラゴンキラー", "回復キラー",
    "攻撃キラー", "体力キラー", "バランスキラー", "能力覚醒用キラー", "売却用キラー", "強化合成用キラー", "進化用キラー", "コンボ強化",
    "ガードブレイク", "追加攻撃", "チームHP強化", "チーム回復強化", "ダメージ無効貫通", "覚醒アシスト", "超追加攻撃", "スキルチャージ",
    "バインド耐性+", "操作時間延長+", "雲耐性", "操作不可耐性", "スキルブースト+", "HP80％以上強化", "HP50％以下強化", "L字消し軽減",
    "L字消し攻撃", "超コンボ強化", "コンボドロップ", "スキルボイス", "ダンジョンボーナス"
];

let retry = 0;
let timestamp;

let filterEntry = new FilterEntry('#filterentry');
let ruleLibrary = new RuleLibrary('#rulelibrary', '#rule-library-tpl');
let resultArea = new ResultArea('#resultarea', '#result-area-tpl', '#resultconfig');

window.onload = () => {
    if (retry < 10) {
        if (MONSTER && SKILLTAG) {
            $('.overlay').addClass('d-none');
        } else {
            setTimeout(loadDefault, 300);
        }
        retry++;
    } else {
        alert('Connect data error.');
    }

    $('#pageinfo').html(`body: ${document.body.clientWidth}, window: ${window.innerWidth} ~`);
    
    lazyload();
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
                tmpl.find('.resultcardpic').eq(0).addClass('icon-attr');
                tmpl.find('.resultcardpic').eq(0).addClass(`ia-${M['MainAttribute'].toLowerCase() + ((M['SubAttribute'] == 'None') ? '' : M['SubAttribute'].toLowerCase())}`);
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
            list.each((i, e) => {
                let n = e['dataset']['number'];
                let M = MONSTER[n - 1];
                filterEntry.test(M) ? $(e).removeClass('filtered') : $(e).addClass('filtered');
                $(e).find('.resultcardintro').html(e['dataset'][fn]);
                this.cotainer.append(e);
            });
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
            tpl.push(`<i class='icon-kakusei i-kakusei-${KAKUSEI[n[i]]}'></i>`);
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