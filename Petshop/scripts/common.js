function Common(){
    let self=this;
    this.promoBar=
        {
            promoItems:null,
            currentItem:0,
            numberOfItems:0,

        };
    
    this.initialisePromo=function(){
        let promoItems=$("#promo>div");
        this.promoBar.promoItems=promoItems;
        this.promoBar.numberOfItems=promoItems.length;
        this.startdelay();
    }
        this.startDelay()=function(){
            setTimeout(function(){
                self.showNextPromoItem()
            },4000);
        }

    this.showNextPromoItem=function(){
        $(self.promoBar.promoItems).fadeOut("slow").promise().done(function(){
            if (self.promoBar.currentItem>=(self.promoBar.numberOfItems-1)){
                self.promoBar.currentItem=0;
            } else{
                self.promoBar.currentItem++;
            }
            $(self.promoBar.promoItems).eq(self.promoBar.currentItem).fadeIn("slow", function(){
                self.startDelay();
            });
        
        
        
        });
    }

}

$(document).ready(function(){
    app.common=new Common();
    app.common.initialisePromo();
});