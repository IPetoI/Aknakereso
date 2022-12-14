var Akna;
var maradtAknak;
var Zaszlo;

var szamlaloEgy = 0;
var szamlaloTiz = 0;
var szamlaloSzaz = 0;
var szamlalo = 0;
var idoVege = 0;
var idoKezdese = false;
var elsoNyomas = 0;
var perc = 0;

var palyaMerete = 7;
var aknakSzama = 12;
var nehezseg = 1;
var egyedi = false;

var palyaHelye;
var palyaElhelyezkedes=1;
var palyaOldalt=0;

var hatterz= false;
var hatterzene = new Audio("hangefektek/hatterzene.mp3");
var gyozelemHang = new Audio("hangefektek/WIN.wav");
var veresegHang = new Audio("hangefektek/LOSE.wav");

hatterzene.play();
hatterzene.volume = 0.03;
hatterzene.loop=true;

var randomSzamGeneralas = function( min, max ) {
    return Math.floor( Math.random() * ( max - min ) ) + min;
}

function cella( sor, oszlop, nyitvaVan, akna, szamok, zaszlo ) {
    return { id: sor + "" + oszlop, sor: sor,oszlop: oszlop, nyitvaVan: nyitvaVan, akna: akna, szamok: szamok, zaszlo: zaszlo, }
}

function palyaElhelyezese() {
    if (nehezseg==0 && palyaElhelyezkedes == 0) {
        palyaOldalt = '13%';
     }else if (nehezseg==1 && palyaElhelyezkedes == 0) {
        palyaOldalt = '16%';
     }else if (nehezseg==2 && palyaElhelyezkedes == 0) {
        palyaOldalt = '21%';
     }else if (nehezseg==0 && palyaElhelyezkedes == 1) {
        palyaOldalt = '50%';
     }else if (nehezseg==1 && palyaElhelyezkedes == 1) {
        palyaOldalt = '50%';
     }else if (nehezseg==2 && palyaElhelyezkedes == 1) {
        palyaOldalt = '50%';
     }else if (nehezseg==0 && palyaElhelyezkedes == 2) {
        palyaOldalt = '85%';
     }else if (nehezseg==1 && palyaElhelyezkedes == 2) {
        palyaOldalt = '83%';
     }else if (nehezseg==2 && palyaElhelyezkedes == 2) {
        palyaOldalt = '77.5%';
     }
}

function palyaLetrehozas( palyaMeret, aknaSzam ) {
    if (aknaSzam >= (palyaMeret*palyaMeret-1) || aknakSzama < 1) {
        console.log(alert('Nem megfelelő az aknák száma!'));
        return;
    }
    palyaElhelyezese();

    palyaHelye = document.createElement("div");
    document.body.appendChild(palyaHelye);
    palyaHelye.setAttribute("id","jatekTer");
    $('#jatekTer').css( 'width', palyaMeret*49);
    $('#jatekTer').css( 'height', palyaMeret*49);
    $('#jatekTer').css( 'left', palyaOldalt);
    $('#jatekTer').css( 'border', '10px solid');
    $('#jatekTer').css( 'border-image', 'url(kepek/keret.png) 20%');
    $('#jatekTer').css( 'border-image-width', '200px');
    $('#jatekTer').css( 'margin-left', (palyaMeret*49)/2*-1);
    $('#jatekTer').css( 'display', 'inline-block');
    var palya = {};
        for (let sor=0; sor<palyaMeret; sor++) {
            for (let oszlop=0; oszlop<palyaMeret; oszlop++) {
                let block = $('<div></div>').addClass("cella");
                palya[sor + "" + oszlop] = cella( sor,oszlop, false,false, false, 0 );
                block.appendTo(palyaHelye);
            }
        }
    palya = aknakSorsolasa( palya, aknaSzam );
    palya = szomszedAknakSzama( palya,palyaMeret );
    return palya;
}

var aknakSorsolasa = function( palya,aknakSzam ) {
    var aknakElhelyezkedese = [];
    for( var i =0; i <aknakSzam; i++ ) {
        var randomOszlop=randomSzamGeneralas( 0,palyaMerete );
        var randomSor =randomSzamGeneralas( 0,palyaMerete );
        var cella = randomSor + "" + randomOszlop;
        while( aknakElhelyezkedese.includes( cella ) ) {
            randomOszlop = randomSzamGeneralas( 0,palyaMerete );
            randomSor = randomSzamGeneralas( 0,palyaMerete );
            cella= randomSor + "" + randomOszlop;
        }
        aknakElhelyezkedese.push( cella );
        palya[cella].akna = true;
    }
    return palya;
}

var ezEgyAkna = function( palya, id ) {
    var cella = palya[id];
    var akna = 0;
    if( typeof cella !== 'undefined' ) {
        akna = cella.akna;
    }
    return akna;
}

var szomszedAknakSzama = function( palya, palyaM ) {
    var cella;
    var szamok = 0;

    for( var sor=0; sor <palyaM; sor++ ) {
        for( var oszlop=0;oszlop<palyaM;oszlop++ ) {
            var id = sor + "" + oszlop;
            cella = palya[id];
            if( !cella.akna ) {
                var szomszedCella = szomszedokVizsgalata( id );
                szamok = 0;
                for( var i =0; i< szomszedCella.length; i++ ) {
                    szamok += ezEgyAkna( palya, szomszedCella[i] );
                }
                cella.szamok = szamok;
            }
        }
    }
    return palya;
}

var szomszedokVizsgalata = function( id ) {
    var sor = parseInt(id[0]);
    var oszlop = parseInt(id[1]);
    var szomszedCellaja = [];
    szomszedCellaja.push( (sor + 1) + "" + (oszlop + 1) );
    szomszedCellaja.push( (sor + 1) + "" + (oszlop - 1) );
    szomszedCellaja.push( (sor + 1) + "" + oszlop );
    szomszedCellaja.push( sor + "" + (oszlop + 1) );
    szomszedCellaja.push( (sor - 1) + "" + (oszlop - 1) );
    szomszedCellaja.push( (sor - 1) + "" + (oszlop + 1) );
    szomszedCellaja.push( (sor - 1) + "" + oszlop );
    szomszedCellaja.push( sor + "" + (oszlop - 1) );

    for( var i = 0; i < szomszedCellaja.length; i++) {
        if ( szomszedCellaja[i].length > 2 ) {
            szomszedCellaja.splice(i, 1);
            i--;
        }
    }
    return szomszedCellaja;
}

var cellaTestreszabas = function( palyaMer ) {
    var sor = 0;
    var oszlop = 0;

    $(".cella").each( function(){
        $(this).attr( "id", sor + "" + oszlop ).css( 'background', 'url(kepek/alap_felso.jpg)');
        $('#' + sor + "" + oszlop ).css( 'background', 'url(kepek/alap_felso.jpg)');

        oszlop++;
        if( oszlop === palyaMer ) {
            oszlop = 0;
            sor++;
        }

        $(this).off().click(function(e) {
            $(".cella").on('mousedown mouseup', function mouseState(e) {
                if (e.type == "mousedown") {
                    $('.gomb').css( 'background', 'url(kepek/nyomsz.jpg)');
                }else if (e.type == "mouseup") {
                    $('.gomb').css( 'background', 'url(kepek/alapf.jpg)');
                }
            });
            $(".gomb").on('mousedown mouseup', function mouseState(e) {
                if (e.type == "mousedown") {
                    $('.gomb').css( 'background', 'url(kepek/alapf_nyom.jpg)');
                }else if (e.type == "mouseup") {
                    $('.gomb').css( 'background', 'url(kepek/alapf.jpg)');
                }
            });

            cellaFelfedes( $(this).attr("id") );
            var gyozelem = true;
            var cellak = Object.keys(palya);

            for( var i = 0; i < cellak.length; i++ ) {
                if( !palya[cellak[i]].akna ) {
                    if( !palya[cellak[i]].nyitvavan ) {
                        gyozelem = false;
                        break;
                    }
                }
            }
            if( gyozelem ) {
                jatekVege = true;
                if (!hatterz) {
                    gyozelemHang.play();
                    gyozelemHang.volume = 0.05;
                }
                $('.gomb').css( 'background', 'url(kepek/nyertel.jpg)');
                clearInterval( idoVege );
                var jatekos = prompt("Adja meg a nevét:", "Aknavadász");
                
                if (palyaMer === 5 && !egyedi) {
                    localStorage.setItem(jatekos, Number(szamlalo));
                }else if (palyaMer === 7 && !egyedi) {
                    localStorage.setItem(jatekos, Number(szamlalo+1000));
                }else if (palyaMer ===10 && !egyedi) {
                    localStorage.setItem(jatekos, Number(szamlalo+2000));
                }else if (egyedi) {
                    localStorage.setItem(jatekos, Number(szamlalo+3000));
                }

                for( var i = 0; i < cellak.length; i++ ) {
                    if( palya[cellak[i]].akna && !palya[cellak[i]].zaszlo ) {
                        $('#' + palya[cellak[i]].id ).html( Akna ).css( 'background', 'url(kepek/zaszlo.jpg)');
                    }
                }
                maradtAknak = 0;
                aknakSzamlaloja();
                toplista();
            }
        });
        $(this).contextmenu(function(e) {
            zaszloLetetele( $(this).attr("id") );
            return false;
        });
    })
}

var cellaFelfedes = function( id ) {
    if( !jatekVege ) {
        // console.log(id + "nincs vege a jateknak");
        elsoNyomas++;
        elsoAkna(id);

        var cella = palya[id];
        var $cell = $( '#' + id );

        if( !cella.nyitvavan ) {
            $('.gomb').css( 'background', 'url(kepek/alapf.jpg)');
            if (elsoNyomas===1) {
                idoKezdese =true;
                ido();
                elsoNyomas++;
            }
            if( !cella.zaszlo ) {
                // console.log(id+ "nem zaszlo");
                if( cella.akna ) {
                    vereseg();
                    $cell.html( Akna ) .css( 'background','url(kepek/robban.jpg)');
                } else {
                    // console.log(id + "nem akna");
                    cella.nyitvavan = true;
                    if( cella.szamok >0 ) {
                        // console.log(id + "szam "+ cella.szamok);
                        var kep = szamok( cella.szamok );
                        $cell.html( cella.szamok ).css( 'background', kep);
                    } else {
                        // console.log(id+ "nincs semmi");
                        $cell.html( "" ).css( 'background', 'url(kepek/alap.jpg)');
                        var szomszedCela = szomszedokVizsgalata( id );
                        for( var i = 0; i < szomszedCela.length; i++ ) {
                            var szomszed = szomszedCela[i];
                            // console.log(id+ " "+ szomszed);
                            if(  typeof palya[szomszed] !== 'undefined' && !palya[szomszed].zaszlo && !palya[szomszed].nyitvavan ) {
                                cellaFelfedes(szomszed);
                            }
                        }
                    }
                }
            }
        }
    }
}

var zaszloLetetele = function( id ) {
    if( !jatekVege ) {
        var cella = palya[id];
        var $cell = $( '#' + id );

        if( !cella.nyitvavan ) {
            if( !cella.zaszlo && maradtAknak > 0 ) {
                cella.zaszlo = true;
                $cell.html( Zaszlo ).css( 'background', 'url(kepek/zaszlo.jpg)');
                maradtAknak--;
                aknakSzamlaloja();
            }else if( cella.zaszlo ) {
                cella.zaszlo = false;
                $cell.html( "" ).css( 'background', 'url(kepek/alap_felso.jpg)');
                maradtAknak++;
                aknakSzamlaloja();
            }
        }
    }
}

var vereseg = function() {
    jatekVege = true;

    if (!hatterz) {
        veresegHang.play();
        veresegHang.volume = 0.05;
    }
    $('.gomb').css( 'background', 'url(kepek/meghaltal.jpg)');
    var cellak = Object.keys(palya);

    for( var i = 0; i < cellak.length; i++ ) {
        if( palya[cellak[i]].akna && !palya[cellak[i]].zaszlo ) {
            $('#' + palya[cellak[i]].id ).html( Akna ).css( 'background', 'url(kepek/akna.jpg)');
        } else if (!palya[cellak[i]].akna && palya[cellak[i]].zaszlo) {
            $('#' + palya[cellak[i]].id ).html( Akna ).css( 'background', 'url(kepek/nem_akna.jpg)');
        }
    }
    clearInterval(idoVege);
}

var szamok = function( szam ) {
    var kep = 'url(kepek/alap.jpg)';
    if( szam === 1 ) {
        kep = 'url(kepek/1.jpg)';
    }else if( szam === 2 ) {
        kep = 'url(kepek/2.jpg)';
    }else if( szam === 3 ) {
        kep = 'url(kepek/3.jpg)';
    }else if( szam === 4 ) {
        kep = 'url(kepek/4.jpg)';
    }else if( szam === 5 ) {
        kep = 'url(kepek/5.jpg)';
    }else if( szam === 6 ) {
        kep = 'url(kepek/6.jpg)';
    }else if( szam === 7 ) {
        kep = 'url(kepek/7.jpg)';
    }else if( szam === 8 ) {
        kep = 'url(kepek/8.jpg)';
    }
    return kep;
}

var ido = function() {
    if (idoKezdese) {
        idoVege = setInterval(function () {
           idoKep1(szamlaloEgy);
            if (szamlaloEgy === 9) {
                szamlaloEgy=-1;
            }else if (szamlaloEgy === 0 && szamlalo!==0) {
                szamlaloTiz++;
                idoKep10(szamlaloTiz);
                if (szamlaloTiz === 9) {
                    szamlaloTiz=-1;
                }else if (szamlaloTiz === 0 && szamlalo>99) {
                    szamlaloSzaz++;
                    idoKep100(szamlaloSzaz);
                }
            }
            if( szamlalo < 999 ) {
                szamlalo++;
                szamlaloEgy++;
            }
        }, 1000);
    }
}

var aknakSzamlaloja = function() {

    if (maradtAknak===0) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido0.png)');
    }else if (maradtAknak ===1) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido1.png)');
    }else if (maradtAknak ===2) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido2.png)');
    }else if (maradtAknak ===3) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido3.png)');
    }else if (maradtAknak ===4) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido4.png)');
    }else if (maradtAknak ===5) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido5.png)');
    }else if (maradtAknak ===6) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido6.png)');
    }else if (maradtAknak ===7) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido7.png)');
    }else if (maradtAknak ===8) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido8.png)');
    }else if (maradtAknak ===9) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido9.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido0.png)');
    }else if (maradtAknak ===10) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido0.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido1.png)');
    }else if (maradtAknak ===11) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido1.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido1.png)');
    }else if (maradtAknak ===12) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido2.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido1.png)');
    }else if (maradtAknak ===13) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido3.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido1.png)');
    }else if (maradtAknak ===14) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido4.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido1.png)');
    }else if (maradtAknak ===15) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido5.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido1.png)');
    }else if (maradtAknak ===16) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido6.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido1.png)');
    }else if (maradtAknak ===17) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido7.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido1.png)');
    }else if (maradtAknak ===18) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido8.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido1.png)');
    }else if (maradtAknak ===19) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido9.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido1.png)');
    }else if (maradtAknak ===20) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido0.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido2.png)');
    }else if (maradtAknak ===21) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido1.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido2.png)');
    }else if (maradtAknak ===22) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido2.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido2.png)');
    }else if (maradtAknak ===23) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido3.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido2.png)');
    }else if (maradtAknak ===24) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido4.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido2.png)');
    }else if (maradtAknak ===25) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido5.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido2.png)');
    }else if (maradtAknak ===26) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido6.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido2.png)');
    }else if (maradtAknak ===27) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido7.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido2.png)');
    }else if (maradtAknak ===28) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido8.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido2.png)');
    }else if (maradtAknak ===29) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido9.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido2.png)');
    }else if (maradtAknak ===30) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido0.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido3.png)');
    }else if (maradtAknak ===31) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido1.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido3.png)');
    }else if (maradtAknak ===32) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido2.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido3.png)');
    }else if (maradtAknak ===33) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido3.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido3.png)');
    }else if (maradtAknak ===34) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido4.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido3.png)');
    }else if (maradtAknak ===35) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido5.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido3.png)');
    }else if (maradtAknak ===36) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido6.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido3.png)');
    }else if (maradtAknak ===37) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido7.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido3.png)');
    }else if (maradtAknak ===38) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido8.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido3.png)');
    }else if (maradtAknak ===39) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido9.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido3.png)');
    }else if (maradtAknak ===40) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido0.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido4.png)');
    }else if (maradtAknak ===41) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido1.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido4.png)');
    }else if (maradtAknak ===42) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido2.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido4.png)');
    }else if (maradtAknak ===43) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido3.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido4.png)');
    }else if (maradtAknak ===44) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido4.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido4.png)');
    }else if (maradtAknak ===45) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido5.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido4.png)');
    }else if (maradtAknak ===46) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido6.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido4.png)');
    }else if (maradtAknak ===47) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido7.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido4.png)');
    }else if (maradtAknak ===48) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido8.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido4.png)');
    }else if (maradtAknak ===49) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido9.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido4.png)');
    }else if (maradtAknak ===50) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido0.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido5.png)');
    }else if (maradtAknak ===51) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido1.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido5.png)');
    }else if (maradtAknak ===52) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido2.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido5.png)');
    }else if (maradtAknak ===53) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido3.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido5.png)');
    }else if (maradtAknak ===54) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido4.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido5.png)');
    }else if (maradtAknak ===55) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido5.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido5.png)');
    }else if (maradtAknak ===56) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido6.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido5.png)');
    }else if (maradtAknak ===57) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido7.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido5.png)');
    }else if (maradtAknak ===58) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido8.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido5.png)');
    }else if (maradtAknak ===59) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido9.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido5.png)');
    }else if (maradtAknak ===60) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido0.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido6.png)');
    }else if (maradtAknak ===61) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido1.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido6.png)');
    }else if (maradtAknak ===62) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido2.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido6.png)');
    }else if (maradtAknak ===63) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido3.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido6.png)');
    }else if (maradtAknak ===64) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido4.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido6.png)');
    }else if (maradtAknak ===65) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido5.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido6.png)');
    }else if (maradtAknak ===66) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido6.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido6.png)');
    }else if (maradtAknak ===67) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido7.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido6.png)');
    }else if (maradtAknak ===68) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido8.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido6.png)');
    }else if (maradtAknak ===69) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido9.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido6.png)');
    }else if (maradtAknak ===70) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido0.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido7.png)');
    }else if (maradtAknak ===71) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido1.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido7.png)');
    }else if (maradtAknak ===72) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido2.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido7.png)');
    }else if (maradtAknak ===73) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido3.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido7.png)');
    }else if (maradtAknak ===74) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido4.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido7.png)');
    }else if (maradtAknak ===75) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido5.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido7.png)');
    }else if (maradtAknak ===76) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido6.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido7.png)');
    }else if (maradtAknak ===77) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido7.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido7.png)');
    }else if (maradtAknak ===78) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido8.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido7.png)');
    }else if (maradtAknak ===79) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido9.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido7.png)');
    }else if (maradtAknak ===80) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido0.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido8.png)');
    }else if (maradtAknak ===81) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido1.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido8.png)');
    }else if (maradtAknak ===82) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido2.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido8.png)');
    }else if (maradtAknak ===83) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido3.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido8.png)');
    }else if (maradtAknak ===84) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido4.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido8.png)');
    }else if (maradtAknak ===85) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido5.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido8.png)');
    }else if (maradtAknak ===86) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido6.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido8.png)');
    }else if (maradtAknak ===87) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido7.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido8.png)');
    }else if (maradtAknak ===88) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido8.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido8.png)');
    }else if (maradtAknak ===89) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido9.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido8.png)');
    }else if (maradtAknak ===90) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido0.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido9.png)');
    }else if (maradtAknak ===91) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido1.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido9.png)');
    }else if (maradtAknak ===92) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido2.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido9.png)');
    }else if (maradtAknak ===93) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido3.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido9.png)');
    }else if (maradtAknak ===94) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido4.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido9.png)');
    }else if (maradtAknak ===95) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido5.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido9.png)');
    }else if (maradtAknak ===96) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido6.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido9.png)');
    }else if (maradtAknak ===97) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido7.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido9.png)');
    }else if (maradtAknak ===98) {
        $('#aknakSzama').css( 'background', 'url(kepek/ido8.png)');
        $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido9.png)');
    }
}

var idoKep1 = function( szamlalo ) {
    if (szamlalo ===0) {
        $('#ido').css( 'background', 'url(kepek/ido0.png)');
    }else if (szamlalo ===1) {
        $('#ido').css( 'background', 'url(kepek/ido1.png)');
    }else if (szamlalo ===2) {
        $('#ido').css( 'background', 'url(kepek/ido2.png)');
    }else if (szamlalo ===3) {
        $('#ido').css( 'background', 'url(kepek/ido3.png)');
    }else if (szamlalo ===4) {
        $('#ido').css( 'background', 'url(kepek/ido4.png)');
    }else if (szamlalo ===5) {
        $('#ido').css( 'background', 'url(kepek/ido5.png)');
    }else if (szamlalo ===6) {
        $('#ido').css( 'background', 'url(kepek/ido6.png)');
    }else if (szamlalo ===7) {
        $('#ido').css( 'background', 'url(kepek/ido7.png)');
    }else if (szamlalo ===8) {
        $('#ido').css( 'background', 'url(kepek/ido8.png)');
    }else if (szamlalo ===9) {
        $('#ido').css( 'background', 'url(kepek/ido9.png)');
    }
}

var idoKep10 = function( szamlalo ) {
    if (szamlalo ===0) {
        $('#idoTiz').css( 'background', 'url(kepek/ido0.png)');
    }else if (szamlalo ===1) {
        $('#idoTiz').css( 'background', 'url(kepek/ido1.png)');
    }else if (szamlalo ===2) {
        $('#idoTiz').css( 'background', 'url(kepek/ido2.png)');
    }else if (szamlalo ===3) {
        $('#idoTiz').css( 'background', 'url(kepek/ido3.png)');
    }else if (szamlalo ===4) {
        $('#idoTiz').css( 'background', 'url(kepek/ido4.png)');
    }else if (szamlalo ===5) {
        $('#idoTiz').css( 'background', 'url(kepek/ido5.png)');
    }else if (szamlalo ===6) {
        $('#idoTiz').css( 'background', 'url(kepek/ido6.png)');
    }else if (szamlalo ===7) {
        $('#idoTiz').css( 'background', 'url(kepek/ido7.png)');
    }else if (szamlalo ===8) {
        $('#idoTiz').css( 'background', 'url(kepek/ido8.png)');
    }else if (szamlalo ===9) {
        $('#idoTiz').css( 'background', 'url(kepek/ido9.png)');
    }
}

var idoKep100 = function( szamlalo ) {
    if (szamlalo ===0) {
        $('#idoSzaz').css( 'background', 'url(kepek/ido0.png)');
    }else if (szamlalo ===1) {
        $('#idoSzaz').css( 'background', 'url(kepek/ido1.png)');
    }else if (szamlalo ===2) {
        $('#idoSzaz').css( 'background', 'url(kepek/ido2.png)');
    }else if (szamlalo ===3) {
        $('#idoSzaz').css( 'background', 'url(kepek/ido3.png)');
    }else if (szamlalo ===4) {
        $('#idoSzaz').css( 'background', 'url(kepek/ido4.png)');
    }else if (szamlalo ===5) {
        $('#idoSzaz').css( 'background', 'url(kepek/ido5.png)');
    }else if (szamlalo ===6) {
        $('#idoSzaz').css( 'background', 'url(kepek/ido6.png)');
    }else if (szamlalo ===7) {
        $('#idoSzaz').css( 'background', 'url(kepek/ido7.png)');
    }else if (szamlalo ===8) {
        $('#idoSzaz').css( 'background', 'url(kepek/ido8.png)');
    }else if (szamlalo ===9) {
        $('#idoSzaz').css( 'background', 'url(kepek/ido9.png)');
    }
}

var ujJatek = function( palyameret, aknak ) {
    maradtAknak = aknak;
    $('#ido').css( 'background', 'url(kepek/ido0.png)');
    $('#idoTiz').css( 'background', 'url(kepek/ido0.png)');
    $('#idoSzaz').css( 'background', 'url(kepek/ido0.png)');
    $('#aknakSzama').css( 'background', 'url(kepek/ido0.png)');
    $('#aknakSzamaTiz').css( 'background', 'url(kepek/ido0.png)');
    $('#aknakSzamaSzaz').css( 'background', 'url(kepek/ido0.png)');
    $('.gomb').css( 'background', 'url(kepek/alapf.jpg)');
    aknakSzamlaloja();
    jatekVege = false;
    cellaTestreszabas( palyameret );
    palya = palyaLetrehozas( palyameret, aknak );
    szamlalo = 0;
    szamlaloEgy = 0;
    szamlaloTiz = 0;
    szamlaloSzaz = 0;
    elsoNyomas=0;
    clearInterval(idoVege);

    return palya;
}

function toplista() {

    var adatKezdo = [];
    var adatKozepes = [];
    var adatHalado = [];
    var adatEgyeni = [];
    var k=0,l=0,m=0,n=0;

    if (!egyedi && palyaMerete===5) {
        for (var i = 0; i < localStorage.length;i++) {
            if (parseInt(localStorage.getItem(localStorage.key(i)))<1000) {
                adatKezdo[k] = [localStorage.key(i), parseInt(localStorage.getItem(localStorage.key(i)))];
                k++;
            }
        }
    }
    if (!egyedi && palyaMerete===7) {
        for (var j = 0; j < localStorage.length;j++) {
            if (parseInt(localStorage.getItem(localStorage.key(j)))>=1000 && parseInt(localStorage.getItem(localStorage.key(j)))<2000) {
                adatKozepes[l] = [localStorage.key(j), parseInt(localStorage.getItem(localStorage.key(j)))-1000];
                l++;
            }
        }
    }
    if (!egyedi && palyaMerete===10) {
        for (var z = 0; z < localStorage.length;z++) {
            if (parseInt(localStorage.getItem(localStorage.key(z)))>=2000 && parseInt(localStorage.getItem(localStorage.key(z)))<3000) {
                adatHalado[m] = [localStorage.key(z), parseInt(localStorage.getItem(localStorage.key(z)))-2000];
                m++;
            }
        }
    }
    if (egyedi) {
        for (var y = 0; y < localStorage.length;y++) {
            if (parseInt(localStorage.getItem(localStorage.key(y)))>=3000) {
                adatEgyeni[n] = [localStorage.key(y), parseInt(localStorage.getItem(localStorage.key(y)))-3000];
                n++;
            }
        }
    }
    adatKezdo.sort(function (a, b) {
        return a[1] - b[1];
    });
    adatKozepes.sort(function (a, b) {
        return a[1] - b[1];
    });
    adatHalado.sort(function (a, b) {
        return a[1] - b[1];
    });
    adatEgyeni.sort(function (a, b) {
        return a[1] - b[1];
    });

    if(palyaMerete===5 && !egyedi) {
        $( "#top1Kezdo" ).remove();
        percAtvaltas(adatKezdo[0][1]);
        $('#kezdoTopL').append('<p id="top1Kezdo">' + adatKezdo[0][0] + ' - ' + perc +'</p>');
    }else if (palyaMerete===7 && !egyedi) {
        $( "#top1Kozepes" ).remove();
        percAtvaltas(adatKozepes[0][1]);
        $('#kozepesTopL').append('<p id="top1Kozepes">' + adatKozepes[0][0] + ' - ' + perc + '</p>');
    }else if (palyaMerete===10 && !egyedi) {
        $( "#top1Halado" ).remove();
        percAtvaltas(adatHalado[0][1]);
        $('#haladoTopL').append('<p id="top1Halado">' + adatHalado[0][0] + ' - ' + perc + '</p>');
    }else if (egyedi) {
        $( "#top1Egyedi" ).remove();
        percAtvaltas(adatEgyeni[0][1]);
        $('#egyediTopL').append('<p id="top1Egyedi">' + adatEgyeni[0][0] + ' - ' + perc + '</p>');
    }
}

function percAtvaltas(masodperc) {
    var maradek = masodperc%60;
    perc=masodperc/60;

    if (perc/60<10) {
        if (maradek%60<10) {
            perc = "0"+(parseInt(masodperc/60))+":0"+maradek;
        }else if (maradek%60>=10) {
            perc = "0"+(parseInt(masodperc/60))+":"+maradek;
        }
    }else if (perc/60>=10) {
        if (maradek%60<10) {
            perc = (parseInt(masodperc/60))+":0"+maradek;
        }else if (maradek%60>=10) {
            perc = (parseInt(masodperc/60))+":"+maradek;
        }
    }
}

function elsoAkna(id) {
    var cella = palya[id];

    if (elsoNyomas === 1 && cella.akna) {
        $( "#jatekTer" ).remove();
        palya = ujJatek( palyaMerete, aknakSzama );
        cellaTestreszabas( palyaMerete );
        elsoNyomas=1;
        elsoAkna(id);
    }
}

function toplistaGy() {
    $('#kozepesTopL').css( 'left', '0%');
    $('#kezdoTopL').css( 'left', '0%');
    $('#haladoTopL').css( 'left', '68%');
    $('#egyediTopL').css( 'left', '68%');
}

$(function () {
    //localStorage.clear();   //Toplista törlése
    
    document.getElementById('kezdo').onclick = kezdo => {
        egyedi=false;
        nehezseg=0;
        palyaMerete=5;
        aknakSzama=4;
        palya = ujJatek( palyaMerete, aknakSzama );

        $( "#jatekTer" ).remove();
        $('#jatekFejlec').css( 'width', '246px');
        $('#jatekFejlec').css( 'margin-left', '-123px');
        $('#ido').css( 'left', '60px');
        $('#idoTiz').css( 'left', '30px');
        $('#idoSzaz').css( 'left', '0');
        $('#aknakSzama').css( 'right', '0');
        $('#aknakSzamaTiz').css( 'right', '30px');
        $('#aknakSzamaSzaz').css( 'right', '60px');
        if (palyaElhelyezkedes==0) {
            $('#jatekFejlec').css( 'left', '13%');
            toplistaGy();
        }else if (palyaElhelyezkedes==1) {
            $('#jatekFejlec').css( 'left', '50%');
            toplistaGy();
        }else {
            $('#jatekFejlec').css( 'left', '85%');
            toplistaGy();
        }
        toplista();
    };

    document.getElementById('kozepes').onclick = kozepes => {
        egyedi=false;
        nehezseg=1;
        palyaMerete=7;
        aknakSzama=12;
        palya = ujJatek( palyaMerete, aknakSzama );

        $( "#jatekTer" ).remove();
        $('#jatekFejlec').css( 'width', '345px');
        $('#jatekFejlec').css( 'margin-left', '-172px');
        if (palyaElhelyezkedes==0) {
            $('#jatekFejlec').css( 'left', '16%');
            toplistaGy();
         }else if (palyaElhelyezkedes==1) {
             $('#jatekFejlec').css( 'left', '50%');
             toplistaGy();
         }else {
             $('#jatekFejlec').css( 'left', '83%');
             toplistaGy();
         }
        toplista();
    };

    document.getElementById('halado').onclick = halado => {
        egyedi=false;
        nehezseg=2;
        palyaMerete=10;
        aknakSzama=30;
        palya = ujJatek( palyaMerete, aknakSzama );

        $( "#jatekTer" ).remove();
        $('#jatekFejlec').css( 'width', '490px');
        $('#jatekFejlec').css( 'margin-left', '-245px');
        if (palyaElhelyezkedes==0) {
            $('#jatekFejlec').css( 'left', '21%');
            $('#kozepesTopL').css( 'left', '38%');
            $('#kezdoTopL').css( 'left', '38%');
            $('#haladoTopL').css( 'left', '68%');
            $('#egyediTopL').css( 'left', '68%');
         }else if (palyaElhelyezkedes==1) {
             $('#jatekFejlec').css( 'left', '50%');
             toplistaGy();
         }else {
             $('#jatekFejlec').css( 'left', '77.5%');
             $('#kozepesTopL').css( 'left', '0%');
             $('#kezdoTopL').css( 'left', '0%');
             $('#haladoTopL').css( 'left', '30%');
             $('#egyediTopL').css( 'left', '30%');
         }
        toplista();
    };

    $('#ujJatekGomb').click( function(){
        $( "#jatekTer" ).remove();
        palya = ujJatek( palyaMerete, aknakSzama );
        cellaTestreszabas( palyaMerete );
        toplista();
    })

    $('#ujJatek').click( function(){
        egyedi=true;
        $( "#jatekTer" ).remove();
        if (document.getElementById("radio5").checked) {
            $('#jatekFejlec').css( 'width', '246px');
            $('#jatekFejlec').css( 'margin-left', '-123px');
            $('#ido').css( 'left', '60px');
            $('#idoTiz').css( 'left', '30px');
            $('#idoSzaz').css( 'left', '0');
            $('#aknakSzama').css( 'right', '0');
            $('#aknakSzamaTiz').css( 'right', '30px');
            if (palyaElhelyezkedes==0) {
                $('#jatekFejlec').css( 'left', '13%');
                toplistaGy();
            }else if (palyaElhelyezkedes==1) {
                $('#jatekFejlec').css( 'left', '50%');
                toplistaGy();
            }else {
                $('#jatekFejlec').css( 'left', '85%');
                toplistaGy();
            }
            $('#aknakSzamaSzaz').css( 'right', '60px');
            nehezseg=0;
            palyaMerete=5;
            aknakSzama=parseInt(document.getElementById("aknak").value);
        }else if (document.getElementById("radio7").checked) {
            $('#jatekFejlec').css( 'width', '345px');
            $('#jatekFejlec').css( 'margin-left', '-172px');
            if (palyaElhelyezkedes==0) {
                $('#jatekFejlec').css( 'left', '16%');
                toplistaGy();
            }else if (palyaElhelyezkedes==1) {
                $('#jatekFejlec').css( 'left', '50%');
                toplistaGy();
            }else {
                $('#jatekFejlec').css( 'left', '83%');
                toplistaGy();
            }
            nehezseg=1;
            palyaMerete=7;
            aknakSzama=parseInt(document.getElementById("aknak").value);
            maradtAknak=aknakSzama;
        }else if (document.getElementById("radio10").checked) {
            $('#jatekFejlec').css( 'width', '490px');
            $('#jatekFejlec').css( 'margin-left', '-245px');
            if (palyaElhelyezkedes==0) {
                $('#jatekFejlec').css( 'left', '21%');
                $('#kozepesTopL').css( 'left', '38%');
                $('#kezdoTopL').css( 'left', '38%');
                $('#haladoTopL').css( 'left', '68%');
                $('#egyediTopL').css( 'left', '68%');
            }else if (palyaElhelyezkedes==1) {
                $('#jatekFejlec').css( 'left', '50%');
                toplistaGy();
            }else {
                $('#jatekFejlec').css( 'left', '77.5%');
                $('#kozepesTopL').css( 'left', '0%');
                $('#kezdoTopL').css( 'left', '0%');
                $('#haladoTopL').css( 'left', '30%');
                $('#egyediTopL').css( 'left', '30%');
            }
            nehezseg=2;
            palyaMerete=10;
            aknakSzama=parseInt(document.getElementById("aknak").value);
            maradtAknak=aknakSzama;
        }

        $( "#jatekTer" ).remove();
        palya = ujJatek( palyaMerete, aknakSzama );
        cellaTestreszabas( palyaMerete );
        toplista();
    })

    document.getElementById('bal').onclick = bal => {
        palyaElhelyezkedes = 0;

        if (nehezseg==0) {
            $('#jatekTer').css( 'left', '13%');
            $('#jatekFejlec').css( 'left', '13%');
            toplistaGy();
         }else if (nehezseg==1) {
            $('#jatekTer').css( 'left', '16%');
            $('#jatekFejlec').css( 'left', '16%');
            toplistaGy();
         }else {
            $('#jatekTer').css( 'left', '21%');
            $('#jatekFejlec').css( 'left', '21%');
            $('#kozepesTopL').css( 'left', '38%');
            $('#kezdoTopL').css( 'left', '38%');
            $('#haladoTopL').css( 'left', '68%');
            $('#egyediTopL').css( 'left', '68%');
         }
    };

    document.getElementById('kozep').onclick = kozep => {
        palyaElhelyezkedes = 1;

        if (nehezseg==0) {
            $('#jatekTer').css( 'left', '50%');
            $('#jatekFejlec').css( 'left', '50%');
            toplistaGy();
         }else if (nehezseg==1) {
            $('#jatekTer').css( 'left', '50%');
            $('#jatekFejlec').css( 'left', '50%');
            toplistaGy();
         }else {
            $('#jatekTer').css( 'left', '50%');
            $('#jatekFejlec').css( 'left', '50%');
            toplistaGy();
         }
    };

    document.getElementById('jobb').onclick = jobb => {
        palyaElhelyezkedes = 2;

        if (nehezseg==0) {
            $('#jatekTer').css( 'left', '85%');
            $('#jatekFejlec').css( 'left', '85%');
            toplistaGy();
         }else if (nehezseg==1) {
            $('#jatekTer').css( 'left', '83%');
            $('#jatekFejlec').css( 'left', '83%');
            toplistaGy();
         }else {
            $('#jatekTer').css( 'left', '77.5%');
            $('#jatekFejlec').css( 'left', '77.5%');
            $('#kozepesTopL').css( 'left', '0%');
            $('#kezdoTopL').css( 'left', '0%');
            $('#haladoTopL').css( 'left', '30%');
            $('#egyediTopL').css( 'left', '30%');
         }
    };

    document.getElementById('zeneG').onclick = zene => {
        if (!hatterz) {
            document.getElementById("zeneG").style.backgroundColor = "#cfcfcf";
            document.getElementById("hangIkon").style.display = "none";
            document.getElementById("nemaIkon").style.display = "block";
            hatterzene.pause();
            hatterz=true;
        } else if (hatterz) {
            document.getElementById("zeneG").style.backgroundColor = "#545454";
            document.getElementById("hangIkon").style.display = "block";
            document.getElementById("nemaIkon").style.display = "none";
            hatterzene.play();
            hatterz=false;
        }
    };
});

function maxAknakSzama() {
    if (document.getElementById("radio5").checked) {
        var x = document.getElementById("aknak").max = "23";
    }else if (document.getElementById("radio7").checked) {
        var x = document.getElementById("aknak").max = "47";
    }else if (document.getElementById("radio10").checked) {
        var x = document.getElementById("aknak").max = "98";
    }
  }