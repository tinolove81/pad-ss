let retry = 0;
let monster;
let skilltag;
let element = {
    'none': '(.*)', 'all': '全', 'row': '横', 'col': '縦', 'random': '隨機', 'fire': '火',
    'water': '水', 'wood': '木', 'light': '光', 'dark': '闇', 'heart': '回復', 'trash': '邪魔', 
    'poison': '毒', 'mpoison': '猛毒', 'bomb': '爆弾' };
let SearchMonster = [];
let ruleLibrary = new RuleLibrary('#rulelibrary', '#rule-library-tpl');
let resultArea = new ResultArea('#resultarea', '#result-area-min-tpl', '#result-area-detail-tpl', '#resultconfig');

$.getJSON('./lib/CHAR_modify.json', function (data) {
    monster = data;
});
$.getJSON('./lib/TAG.json', function (data) {
    skilltag = data;
});

(function loadDefault() {
    if (retry < 10) {
        if (monster != undefined && skilltag != undefined) {
            $('input').not('#resultconfig input').prop('checked', false);
            $('select').not('#resultconfig select').prop('value', 0);
            $('.overlay').addClass('d-none');
        } else {
            setTimeout(loadDefault, 300);
        }
        retry++;
    } else {
        alert('Connect database error.');
    }
})();

$('#btnAddRule').on('click', function (e) {
    let A = $('input[name="Change_A"]:checked').val();
    let B = $('input[name="Change_B"]:checked').val();
    if (A && B) {
        ruleLibrary.addRule(`${A}-${B}`);
    } else {
        alert('選項缺失!');
    }
});

function RuleLibrary(mCotainer, mTemplate) {
    this.cotainer = $(mCotainer);
    this.template = $(mTemplate);

    this.AllRule = {};

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
        if (this.searchresult.length) {
            this.cotainer.html('');
            if (this.style == 'icon') {
                this.cotainer.removeClass('flex-column');
                this.searchresult.forEach((e, i) => {
                    let tpl = this.mtpl.html();
                    let M = monster[e['no'] - 1 ];
                    this.cotainer.append(tpl
                        .replace('{{DataNumber}}', e['no'])
                        .replace('{{DataName}}', M['Name'])
                        .replace('{{DataRare}}', M['Rare'].replace('★', ''))
                        .replace('{{DataSkillCDMin}}', M['ActiveSkillCD'].replace('）', '').split('（')[0])
                        .replace('{{DataSkillCDMax}}', M['ActiveSkillCD'].replace('）', '').split('（')[1])
                        .replace('{{MonsterNumber}}', e['no'])
                    );
                });
            } else if (this.style == 'list') {
                this.cotainer.addClass('flex-column');
                this.searchresult.forEach((e, i) => {
                    let tpl = this.dtpl.html();
                    let M = monster[e['no'] - 1 ];
                    this.cotainer.append(tpl
                        .replace('{{DataNumber}}', e['no'])
                        .replace('{{DataRare}}', M['Rare'].replace('★', ''))
                        .replace('{{DataSkillCDMin}}', M['ActiveSkillCD'].replace('）', '').split('（')[0])
                        .replace('{{DataSkillCDMax}}', M['ActiveSkillCD'].replace('）', '').split('（')[1])
                        .replace('{{MonsterNumber}}', e['no'])
                        .replace('{{MonsterName}}', M['Name'])
                        .replace('{{MonsterRare}}', M['Rare'])
                        .replace('{{MonsterSkillName}}', M['ActiveSkillName'])
                        .replace('{{MonsterSkillCD}}', M['ActiveSkillCD'])
                        .replace('{{MonsterSkill}}', M['ActiveSkillContent'])
                        .replace('{{MonsterKakusei}}', iconKakuseiTpl(M['Kakusei']))
                    );
                });
            }
            this.sorter();
        }
    };
    this.sorter = () => {
        let fn = this.sort;
        let order = this.sortorder;
        let list = this.cotainer.find('.sort-item').sort(function (a, b) {
            if (order == 'asc') {
                return +a['dataset'][fn] - +b['dataset'][fn];
            } else if (order == 'desc') {
                return +b['dataset'][fn] - +a['dataset'][fn];
            }
        });
        if (this.style == 'icon') {
            $.each(list, (i, e) => {
                $(e).find('.sortdata').html(e['dataset'][fn]);
                this.cotainer.append(e).children(':last').hide().fadeIn();
            });
        } else if (this.style == 'list') {
            $.each(list, (i, e) => {
                this.cotainer.append(e).children(':last').hide().fadeIn();
            });
        }
    };
}

function iconDropTpl(n) {
    if (n == 'none'||n == 'all'||n == 'row'||n == 'col'||n == 'random') {
        return `<i class="icon-${n}"></i>`;
    } else {
        return `<i class="icon-drop id-${n}"></i>`;
    }
}
function iconKakuseiTpl(n) {
    if (n.length) {
        let tpl = [];
        let kakusei = {
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