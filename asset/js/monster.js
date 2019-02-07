
var app = new Vue({
    el: '#app',
    data: {
        'MONSTER': MONSTER,
        'SKILLTAG': SKILLTAG,
        'KAKUSEI': {
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
        },
        TYPE: {
            'god': '神', 'dragon': 'ドラゴン', 'evil': '悪魔', 'machine': 'マシン',
            'balance': 'バランス', 'attack': '攻撃', 'vitality': '体力', 'recovery': '回復',
            'evo': '進化用', 'awaken': '能力覚醒用', 'strong': '強化合成用', 'sale': '売却用'
        },
        'overlay': false,
        'theme': 'theme-dark',
        'hasMonster': false,
        'monsterinfo': {
            'Number': undefined,
            'Name': undefined,
            'Attr': undefined,
            'Rare': undefined,
            'Type': undefined,
            'SkillName': undefined,
            'SkillCD': undefined,
            'Skill': undefined,
            'Kakusei': undefined
        }
    },
    watch: {
        monsterNumber: function(newValue, oldValue) {
            let n = parseInt(this.monsterNumber) - 1;
            if (n > 0) {
                this.hasMonster = true;
            } else {
                this.hasMonster = false;
                return false;
            }
            let m = this.MONSTER[n];
            if (m != undefined) {
                this.monsterinfo.Number = m.Number;
                let r = parseInt(m.Rare.replace('★', ''));
                this.monsterinfo.Rare = '';
                while (r > 0) {
                    this.monsterinfo.Rare += '★';
                    r -= 1;
                };
                this.monsterinfo.Name = m.Name;
                this.monsterinfo.Type = m.Type;
                this.monsterinfo.Kakusei = m.Kakusei;
                this.monsterinfo.Attr = 'ia-' + ((m.MainAttribute == '') ? '' : m.MainAttribute.toLowerCase()) + ((m.SubAttribute == '' || m.SubAttribute == 'None') ? '' : m.SubAttribute.toLowerCase());
                
                this.monsterinfo.SkillName = m.ActiveSkillName;
                let c = m.ActiveSkillCD.replace('）', '').split('（');
                this.monsterinfo.SkillCD = `Lv.1 ターン:${c[0]}　最大ターン:${c[1]}`;
                this.monsterinfo.Skill = m.ActiveSkillContent;
                this.monsterinfo.LSkillName = m.LeaderSkillName;
                this.monsterinfo.LSkill = m.LeaderSkillContent;
            } else {
                this.monsterinfo.Number = undefined;
                this.monsterinfo.Rare = undefined;
                this.monsterinfo.Name = undefined;
                this.monsterinfo.Type = undefined;
                this.monsterinfo.Kakusei = undefined;
                this.monsterinfo.Attr = undefined;
                this.monsterinfo.SkillName = undefined;
                this.monsterinfo.SkillCD = undefined;
                this.monsterinfo.Skill = undefined;
                this.monsterinfo.LSkillName = undefined;
                this.monsterinfo.LSkill = undefined;
            }
        }
    },
    methods: {
        toggletheme: function () {
            this.theme = (this.theme == 'theme-dark') ? 'theme-light': 'theme-dark';
            return this.theme;
        }
    },
    computed: {
        monsterNumber() {
            return this.monsterinfo.Number;
        }
    }
});